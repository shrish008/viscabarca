"""Build a SOVO memo PDF (plan.html by default), reusing the research report's stylesheet.

Usage: python3 build_plan.py [source.html] [output.pdf]
"""
import pathlib, re, subprocess, sys

HERE = pathlib.Path(__file__).parent
CHROME = sorted(pathlib.Path("/opt/pw-browsers").glob("chromium-*/chrome-linux*/chrome"))[-1]
SRC = HERE / (sys.argv[1] if len(sys.argv) > 1 else "plan.html")
OUT_PDF = HERE / (sys.argv[2] if len(sys.argv) > 2 else "SOVO_Structure_and_Go-Forward_Plan.pdf")

style = re.search(r"<style>.*?</style>", (HERE / "report.html").read_text(), re.S).group(0)
tmp = HERE / "_memo_rendered.html"
tmp.write_text(SRC.read_text().replace("{{STYLE}}", style))
subprocess.run([CHROME, "--headless=new", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer",
                f"--print-to-pdf={OUT_PDF}", tmp.as_uri()], check=True, capture_output=True)
tmp.unlink()
print("wrote", OUT_PDF)
