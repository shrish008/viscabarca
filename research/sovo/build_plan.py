"""Build the SOVO go-forward plan PDF, reusing the research report's stylesheet."""
import pathlib, re, subprocess

HERE = pathlib.Path(__file__).parent
CHROME = sorted(pathlib.Path("/opt/pw-browsers").glob("chromium-*/chrome-linux*/chrome"))[-1]
OUT_PDF = HERE / "SOVO_Structure_and_Go-Forward_Plan.pdf"

style = re.search(r"<style>.*?</style>", (HERE / "report.html").read_text(), re.S).group(0)
tmp = HERE / "_plan_rendered.html"
tmp.write_text((HERE / "plan.html").read_text().replace("{{STYLE}}", style))
subprocess.run([CHROME, "--headless=new", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer",
                f"--print-to-pdf={OUT_PDF}", tmp.as_uri()], check=True, capture_output=True)
tmp.unlink()
print("wrote", OUT_PDF)
