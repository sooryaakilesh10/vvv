import sys

with open('src/index.jsx', 'r') as f:
    content = f.read()

# 1. Update the array
content = content.replace(
    "const CHAPTERS = [C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11, C12, C13, CDrawKaleido, CJokes, C14];",
    "const CHAPTERS = [C1, C2, C3, C4, C5, C6, C7, C10, C11, C12, C13, CDrawKaleido, CJokes, C14];"
)

# 2. Update the chapter numbers
content = content.replace(
    '<p className="eyebrow">chapter nine</p>',
    '<p className="eyebrow">chapter seven</p>'
)

content = content.replace(
    '<p className="eyebrow" style={{ textAlign: "center" }}>chapter ten</p>',
    '<p className="eyebrow" style={{ textAlign: "center" }}>chapter eight</p>'
)

content = content.replace(
    '<p className="eyebrow" style={{ marginBottom: "1.8rem" }}>chapter eleven</p>',
    '<p className="eyebrow" style={{ marginBottom: "1.8rem" }}>chapter nine</p>'
)

content = content.replace(
    '<p className="eyebrow" style={{ marginBottom: "1.5rem" }}>chapter fourteen</p>',
    '<p className="eyebrow" style={{ marginBottom: "1.5rem" }}>chapter twelve</p>'
)

content = content.replace(
    '<p className="eyebrow" style={{ textShadow: "0 2px 10px #000" }}>chapter twelve</p>',
    '<p className="eyebrow" style={{ textShadow: "0 2px 10px #000" }}>chapter ten</p>'
)

content = content.replace(
    '<p className="eyebrow">chapter thirteen</p>',
    '<p className="eyebrow">chapter eleven</p>'
)

with open('src/index.jsx', 'w') as f:
    f.write(content)
