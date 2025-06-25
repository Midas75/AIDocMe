#  [`aidocme.py`](range://?s=0&e=8345&di=0&ds=0&de=0)

```plaintext
no module docs
```

## 1. [`DocType`](range://?s=354&e=418&di=2&ds=379&de=379)

```plaintext
no class docs
```

```python
class DocType(Enum):
```

## 2. [`Content`](range://?s=421&e=1428&di=4&ds=440&de=440)

```plaintext
no class docs
```

```python
class Content:
```

### 2.1. [`__init__`](range://?s=585&e=1077&di=6&ds=825&de=825)

```plaintext
no method docs
```

```python
class Content:
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

### 2.2. [`__repr__`](range://?s=1079&e=1366&di=8&ds=1118&de=1118)

```plaintext
no method docs
```

```python
class Content:
    def __repr__(self) -> str:
```

### 2.3. [`__str__`](range://?s=1368&e=1428&di=10&ds=1406&de=1406)

```plaintext
no method docs
```

```python
class Content:
    def __str__(self) -> str:
```

## 3. [`Sequence`](range://?s=1431&e=1838&di=12&ds=1451&de=1451)

```plaintext
no class docs
```

```python
class Sequence:
```

### 3.1. [`__init__`](range://?s=1470&e=1518&di=14&ds=1502&de=1502)

```plaintext
no method docs
```

```python
class Sequence:
    def __init__(self):
```

### 3.2. [`next_seq`](range://?s=1520&e=1838&di=16&ds=1575&de=1575)

```plaintext
no method docs
```

```python
class Sequence:
    def next_seq(self, level: int = 1) -> str:
```

## 4. [`seg_source`](range://?s=1841&e=2310&di=18&ds=1929&de=1929)

```plaintext
no method docs
```

```python
def seg_source(source: str, contents: list[Content]) -> list[tuple[int, int, str]]:
```

## 5. [`get_docstring_range`](range://?s=2313&e=2904&di=20&ds=2444&de=2444)

```plaintext
no method docs
```

```python
def get_docstring_range(
    node: Module | ClassDef | FunctionDef | AsyncFunctionDef, tokens: ASTTokens
) -> tuple[int, int]:
```

## 6. [`normalize_indent`](range://?s=2907&e=3337&di=22&ds=2943&de=2943)

```plaintext
no method docs
```

```python
def normalize_indent(code_str):
```

### 6.1. [`replace_indent`](range://?s=3070&e=3262&di=24&ds=3105&de=3105)

```plaintext
no method docs
```

```python
def normalize_indent(code_str):
    def replace_indent(m):
```

## 7. [`visit`](range://?s=3340&e=5459&di=26&ds=3482&de=3482)

```plaintext
no method docs
```

```python
def visit(
    node,
    tokens: ASTTokens,
    level: int,
    sig_level: list[str],
    contents: list[Content],
    file_name: str,
):
```

## 8. [`jsonify`](range://?s=5462&e=5558&di=28&ds=5514&de=5514)

```plaintext
no method docs
```

```python
def jsonify(serialized: dict[str, Any]) -> str:
```

## 9. [`markdownify`](range://?s=5561&e=6459&di=30&ds=5617&de=5617)

```plaintext
no method docs
```

```python
def markdownify(serialized: dict[str, Any]) -> str:
```

## 10. [`serialize`](range://?s=6462&e=7468&di=32&ds=6603&de=6603)

```plaintext
no method docs
```

```python
def serialize(
    contents: list[Content],
    seg: list[tuple[int, int, str]],
    file_name: str = "example.py",
) -> dict[str, Any]:
```

## 11. [`process`](range://?s=7471&e=7943&di=34&ds=7597&de=7597)

```plaintext
no method docs
```

```python
def process(
    filepath: str = __file__, source: str = None
) -> tuple[list[Content], list[tuple[int, int, str]], str]:
```

## 12. [`main`](range://?s=7946&e=8305&di=36&ds=7962&de=7962)

```plaintext
no method docs
```

```python
def main():
```