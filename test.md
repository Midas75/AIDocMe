#  [`Module`](range://?s=0&e=7871&di=0&ds=0&de=0)

```plaintext
no module docs
```

## 1. [`DocType`](range://?s=300&e=364&di=2&ds=325&de=325)

```plaintext
no class docs
```

```python
class DocType(Enum):
```

## 2. [`Content`](range://?s=367&e=1374&di=4&ds=386&de=386)

```plaintext
no class docs
```

```python
class Content:
```

### 2.1. [`__init__`](range://?s=531&e=1023&di=6&ds=771&de=771)

```plaintext
no method docs
```

```python
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
```

### 2.2. [`__repr__`](range://?s=1025&e=1312&di=8&ds=1064&de=1064)

```plaintext
no method docs
```

```python
def __repr__(self) -> str:
```

### 2.3. [`__str__`](range://?s=1314&e=1374&di=10&ds=1352&de=1352)

```plaintext
no method docs
```

```python
def __str__(self) -> str:
```

## 3. [`Sequence`](range://?s=1377&e=1784&di=12&ds=1397&de=1397)

```plaintext
no class docs
```

```python
class Sequence:
```

### 3.1. [`__init__`](range://?s=1416&e=1464&di=14&ds=1448&de=1448)

```plaintext
no method docs
```

```python
def __init__(self):
```

### 3.2. [`next_seq`](range://?s=1466&e=1784&di=16&ds=1521&de=1521)

```plaintext
no method docs
```

```python
def next_seq(self, level: int = 1) -> str:
```

## 4. [`seg_source`](range://?s=1787&e=2256&di=18&ds=1875&de=1875)

```plaintext
no method docs
```

```python
def seg_source(source: str, contents: list[Content]) -> list[tuple[int, int, str]]:
```

## 5. [`get_docstring_range`](range://?s=2259&e=2848&di=20&ds=2390&de=2390)

```plaintext
no method docs
```

```python
def get_docstring_range(
    node: Module | ClassDef | FunctionDef | AsyncFunctionDef, tokens: ASTTokens
) -> tuple[int, int]:
```

## 6. [`normalize_indent`](range://?s=2851&e=3281&di=22&ds=2887&de=2887)

```plaintext
no method docs
```

```python
def normalize_indent(code_str):
```

### 6.1. [`replace_indent`](range://?s=3014&e=3206&di=24&ds=3049&de=3049)

```plaintext
no method docs
```

```python
def replace_indent(m):
```

## 7. [`visit`](range://?s=3284&e=5228&di=26&ds=3361&de=3361)

```plaintext
no method docs
```

```python
def visit(node, tokens: ASTTokens, level: int, contents: list[Content]):
```

## 8. [`jsonify`](range://?s=5231&e=5327&di=28&ds=5283&de=5283)

```plaintext
no method docs
```

```python
def jsonify(serialized: dict[str, Any]) -> str:
```

## 9. [`markdownify`](range://?s=5330&e=6228&di=30&ds=5386&de=5386)

```plaintext
no method docs
```

```python
def markdownify(serialized: dict[str, Any]) -> str:
```

## 10. [`serialize`](range://?s=6231&e=7161&di=32&ds=6332&de=6332)

```plaintext
no method docs
```

```python
def serialize(
    contents: list[Content], seg: list[tuple[int, int, str]]
) -> dict[str, Any]:
```

## 11. [`process`](range://?s=7164&e=7520&di=34&ds=7266&de=7266)

```plaintext
no method docs
```

```python
def process(
    filepath: str = __file__,
) -> tuple[list[Content], list[tuple[int, int, str]]]:
```

## 12. [`main`](range://?s=7523&e=7831&di=36&ds=7539&de=7539)

```plaintext
no method docs
```

```python
def main():
```