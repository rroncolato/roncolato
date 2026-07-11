from playwright.sync_api import sync_playwright
import os

def capture_screenshots():
    """Captura screenshots em diferentes resoluções"""

    url = "http://127.0.0.1:8080"

    # Definir viewports a testar
    viewports = {
        "mobile_small_375": {"width": 375, "height": 812},
        "mobile_medium_425": {"width": 425, "height": 812},
        "tablet_768": {"width": 768, "height": 1024},
        "desktop_1920": {"width": 1920, "height": 1080},
    }

    # Criar diretório de screenshots se não existir
    os.makedirs("screenshots", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()

        for device_name, viewport in viewports.items():
            print(f"Capturando screenshot para {device_name}...")

            page = browser.new_page(
                viewport=viewport,
                device_scale_factor=1
            )

            try:
                page.goto(url, wait_until='networkidle', timeout=30000)

                # Capturar página completa
                output_path = f"screenshots/{device_name}_full.png"
                page.screenshot(path=output_path, full_page=True)
                print(f"  ✓ Full page: {output_path}")

                # Capturar above-the-fold (viewport)
                output_path = f"screenshots/{device_name}_atf.png"
                page.screenshot(path=output_path, full_page=False)
                print(f"  ✓ Above-the-fold: {output_path}")

            except Exception as e:
                print(f"  ✗ Erro: {e}")
            finally:
                page.close()

        browser.close()

    print("\nCaptura concluída!")

if __name__ == "__main__":
    capture_screenshots()
