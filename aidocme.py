from os.path import basename
from pathlib import Path
import sys
from enum import Enum
from typing import Any
from json import dumps
from ast import (
    parse,
    Module,
    get_docstring,
    FunctionDef,
    AsyncFunctionDef,
    ClassDef,
    iter_child_nodes,
    Expr,
    Constant,
)
from re import match, sub
from asttokens import ASTTokens


class DocType(Enum):
    MODULE = 0
    METHOD = 1
    CLASS = 2


class Content:
    level: int
    doc_type: DocType
    doc: str
    start: int
    end: int
    doc_start: int
    doc_end: int
    signature: str
    title: str

    def __init__(
        self,
        level: int,
        doc_type: DocType,
        doc: str,
        start: int,
        end: int,
        doc_start: int,
        doc_end: int,
        signature: str,
        title: str,
    ):
        self.level = level
        self.doc_type = doc_type
        self.doc = doc
        self.start = start
        self.end = end
        self.doc_start = doc_start
        self.doc_end = doc_end
        self.signature = signature
        self.title = title

    def __repr__(self) -> str:
        return str(
            [
                self.level,
                self.doc_type,
                self.doc,
                self.start,
                self.end,
                self.signature,
                self.title,
            ]
        )

    def __str__(self) -> str:
        return self.__repr__()


class Sequence:
    number: list[int]

    def __init__(self):
        self.number = []

    def next_seq(self, level: int = 1) -> str:
        if level < 1:
            return ""
        while len(self.number) < level:
            self.number.append(0)
        self.number[level - 1] += 1
        self.number = self.number[:level]
        return ".".join(str(n) for n in self.number[:level] if n > 0) + "."


def seg_source(source: str, contents: list[Content]) -> list[tuple[int, int, str]]:
    result = list[tuple[int, int, str]]()
    last_e = 0
    for c in contents:
        if last_e != c.doc_start:
            result.append((last_e, c.doc_start, source[last_e : c.doc_start]))
        doc = source[c.doc_start : c.doc_end]
        result.append((c.doc_start, c.doc_end, doc))
        last_e = c.doc_end
    result.append((last_e, -1, source[last_e:]))
    return result


def get_docstring_range(
    node: Module | ClassDef | FunctionDef | AsyncFunctionDef, tokens: ASTTokens
) -> tuple[int, int]:
    doc_node = None
    if (  # dont care if node.body is not None and node.body[0] is not None
        isinstance(node.body[0], Expr)
        and isinstance(node.body[0].value, Constant)
        and isinstance(node.body[0].value.value, str)
    ):
        doc_node = node.body[0]
    if doc_node is None:
        ds, _ = tokens.get_text_range(node.body[0], False)
        de = ds
    else:
        ds, de = tokens.get_text_range(doc_node, False)
    return ds, de


def normalize_indent(code_str):
    lines = code_str.splitlines()
    if not lines:
        return code_str
    indent_base = len(match(r" *", lines[0]).group())

    def replace_indent(m):
        newline = m.group(1)
        spaces = m.group(2)
        new_space_count = max(len(spaces) - indent_base, 0)
        return newline + (" " * new_space_count)

    result = sub(r"(\n)( *)", replace_indent, code_str)
    return result


def visit(
    node,
    tokens: ASTTokens,
    level: int,
    sig_level: list[str],
    contents: list[Content],
    file_name: str,
):
    sig = None
    s, e = tokens.get_text_range(node)
    if isinstance(node, (Module, ClassDef, FunctionDef, AsyncFunctionDef)):
        d = get_docstring(node)
        ds, de = get_docstring_range(node, tokens)
        if isinstance(node, FunctionDef | AsyncFunctionDef | ClassDef):
            bs, _ = tokens.get_text_range(node.body[0])
            sig = tokens.get_text(node)[: bs - s]
            sig = sig[: sig.rfind(":") + 1]
            # sig = normalize_indent(sig).lstrip()
    sig_level_copy = sig_level.copy()
    if sig is not None:
        sig_level_copy.append(sig)
    if isinstance(node, Module):
        contents.append(
            Content(
                level,
                doc_type=DocType.MODULE,
                doc="no module docs" if d is None else d,
                start=s,
                end=e,
                doc_start=ds,
                doc_end=de,
                signature="\n".join(sig_level_copy),
                title=file_name,
            )
        )
    elif isinstance(node, FunctionDef | AsyncFunctionDef):

        contents.append(
            Content(
                level,
                doc_type=DocType.METHOD,
                doc="no method docs" if d is None else d,
                start=s,
                end=e,
                doc_start=ds,
                doc_end=de,
                signature="\n".join(sig_level_copy),
                title=node.name,
            )
        )
    elif isinstance(node, ClassDef):
        contents.append(
            Content(
                level,
                doc_type=DocType.CLASS,
                doc="no class docs" if d is None else d,
                start=s,
                end=e,
                doc_start=ds,
                doc_end=de,
                signature="\n".join(sig_level_copy),
                title=node.name,
            )
        )

    for child in iter_child_nodes(node):
        visit(child, tokens, level + 1, sig_level_copy, contents, file_name)


def jsonify(serialized: dict[str, Any]) -> str:
    return dumps(serialized, ensure_ascii=False)


def markdownify(serialized: dict[str, Any]) -> str:
    result_list = list[str]()
    for content in serialized["content"]:
        result_list.append(
            f"{'#'*(content['level']+1)} "
            f"{content['seq']} "
            f"[`{content['title']}`]"
            f"(range://?"
            f"s={content['start']}&e={content['end']}"
            f"&di={content['doc_i']}"
            f"&ds={content['doc_start']}&de={content['doc_end']})"
        )
        result_list.append(f"```plaintext\n{content['doc']}\n```")
        if content["doc_type"] == DocType.MODULE.name:
            pass
        elif content["doc_type"] == DocType.METHOD.name:
            result_list.append(f"```python\n{content['signature']}\n```")
        elif content["doc_type"] == DocType.CLASS.name:
            result_list.append(f"```python\n{content['signature']}\n```")

    return "\n\n".join(result_list)


def serialize(
    contents: list[Content],
    seg: list[tuple[int, int, str]],
    file_name: str = "example.py",
) -> dict[str, Any]:
    result = dict[str, Any]()
    result["file_name"] = file_name
    result["content"] = list[dict]()
    result["seg"] = list[dict]()
    seq = Sequence()
    seg_idx = 0
    for c in contents:
        while seg[seg_idx][0] < c.doc_start:
            seg_idx += 1
        result["content"].append(
            {
                "level": c.level,
                "seq": seq.next_seq(c.level),
                "doc_i": seg_idx,
                "doc_type": c.doc_type.name,
                "doc": c.doc,
                "start": c.start,
                "end": c.end,
                "doc_start": c.doc_start,
                "doc_end": c.doc_end,
                "signature": c.signature,
                "title": c.title,
            }
        )
    for ss, se, sc in seg:
        result["seg"].append({"seg_start": ss, "seg_end": se, "content": sc})
    return result


def process(
    filepath: str = __file__, source: str = None
) -> tuple[list[Content], list[tuple[int, int, str]], str]:
    contents = list[Content]()
    if source is None:
        with open(filepath, encoding="utf-8") as f:
            source = f.read()
    file_name = basename(filepath)
    tree = parse(source)
    tokens = ASTTokens(source, tree=tree)
    visit(tree, tokens, 0, [], contents, file_name)
    return contents, seg_source(source, contents), file_name


def main():
    if len(sys.argv) > 1:
        l, s, fn = process(sys.argv[1])
    else:
        l, s, fn = process()
    ser = serialize(l, s, fn)
    fnn = Path(fn).with_suffix("")
    with open(f"{fnn}.md", "w", encoding="utf-8") as f:
        f.write(markdownify(ser))
    with open(f"{fnn}.json", "w", encoding="utf-8") as f:
        f.write(jsonify(ser))


if __name__ == "__main__":
    main()
