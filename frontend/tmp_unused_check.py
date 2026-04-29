import pathlib
import re
root = pathlib.Path('frontend/src')
miss_motion = []
miss_icon = []
for path in root.rglob('*.*'):
    if path.suffix.lower() not in {'.js', '.jsx', '.ts', '.tsx'}:
        continue
    txt = path.read_text(encoding='utf-8')
    if re.search(r'import\s+\{[^}]*\bmotion\b[^}]*\}', txt) or re.search(r'import\s+motion\b', txt):
        if not re.search(r'<motion\b|\bmotion\.', txt[txt.find('import'):]):
            miss_motion.append(str(path))
    if re.search(r'import\s+\{[^}]*\bIcon\b[^}]*\}', txt) or re.search(r'import\s+Icon\b', txt):
        if len(re.findall(r'\bIcon\b', txt)) <= 1:
            miss_icon.append(str(path))
    if re.search(r'\b(const|let|var|function|class)\s+Icon\b', txt):
        if len(re.findall(r'\bIcon\b', txt)) <= 1:
            miss_icon.append(str(path))
print('motion_unused:', miss_motion)
print('icon_unused:', sorted(set(miss_icon)))
