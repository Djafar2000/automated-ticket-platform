
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TicketBot:
    def __init__(self):
        options = webdriver.ChromeOptions()
        options.add_argument("--start-maximized")
        self.driver = webdriver.Chrome(options=options)
        print("Bot initialized.")

    def run_purchase_flow(self, event_name, ticket_url):
        try:
            print(f"Navigating to {ticket_url} for event: {event_name}")
            self.driver.get(ticket_url)
            
            # --- NEW STEP: Handle the Cookie Consent Pop-up ---
            # We wait up to 10 seconds for the "Accept all" button to be clickable
            # and then we click it. Its ID on Google is "L2AGLb".
            try:
                accept_button = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.ID, "L2AGLb"))
                )
                accept_button.click()
                print("Clicked 'Accept all' on the cookie pop-up.")
            except Exception as cookie_error:
                # If the pop-up doesn't appear (e.g., on a second run), we just log it and continue.
                print(f"Cookie pop-up not found or could not be clicked: {cookie_error}")

            # --- The rest of the code is the same ---

            # 1. Search for the event
            search_box = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.NAME, "q"))
            )
            search_box.send_keys(f"{event_name} tickets")
            search_box.submit()
            print(f"Searched for '{event_name} tickets'.")
            
            # 2. Handle CAPTCHA - Manual Intervention
            print("\n" + "="*50)
            print("MANUAL ACTION REQUIRED: Please solve any CAPTCHA now.")
            print("The bot will wait for you to proceed.")
            print("="*50 + "\n")
            input("Press Enter in this console after solving the CAPTCHA and clicking 'Next'...")
            
            # 3. Attempt to proceed after CAPTCHA
            print("Resuming bot... attempting to find tickets.")
            time.sleep(5) # Simulate looking for tickets

            print("Purchase flow simulation complete.")
            return "success"
            
        except Exception as e:
            print(f"An error occurred in the bot: {e}")
            return "failed"
        finally:
            self.close()

    def close(self):
        print("Closing the browser.")
        self.driver.quit()