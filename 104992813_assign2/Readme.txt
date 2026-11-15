==============================================================================
GUSTIO - Restaurant Discovery and Reservation Platform
COS10005 Web Development - Assignment 2 (August 2026)
==============================================================================

Student name : Yadanar Theint
Student ID   : 104992813
Mercury URL  : http://mercury.swin.edu.au/s104992813/cos10005/assignment2/index.html
GitHub repo  : https://github.com/Treasure-Mei-box/COS10005---Web-Development.git
               (the repository is public / the marker has been given access)


------------------------------------------------------------------------------
1. WEBSITE STRUCTURE
------------------------------------------------------------------------------
assignment2/
  index.html         Home page: purpose, values, photo gallery, target users,
                     services, three featured restaurants with "Reserve a table"
                     links, and a hero image that rotates between dish photos.
  restaurants.html   Listing of six restaurants (cuisine, signature dishes with
                     prices, deposit, 50-100 word description, image, average
                     price per person) plus a "Good to know" aside.
  recommend.html     Recommendation form (cuisine category, diet, budget, dining
                     purpose). Results are produced by JavaScript; a result can
                     be selected and sent to the reservation page.
  register.html      Registration form (front-end only, JavaScript validation).
  reservation.html   Reservation form with a restaurant drop-down, dynamic
                     deposit, voucher / online payment fields and billing email.
  css/style.css      The single external stylesheet linked from every page.
  js/script.js       The single JavaScript file linked from every page.
  images/            logo.png, restaurant1.jpg ... restaurant6.jpg and
                     images/index/ (the dish photos used on the home page and
                     in the recommendation results).
  Readme.txt         This file.

Common features on every page
  - Semantic HTML5: header, nav, main, section, article, aside, footer.
  - The same navigation bar on every page; the current page is highlighted
    (class "active" and aria-current="page") and a "skip to content" link is
    provided for keyboard users.
  - Responsive layout using CSS Grid/Flexbox and media queries:
    Desktop 1024px and wider, Tablet 768px-1023px, Mobile 767px and below
    (the menu collapses into a "Menu" button on mobile).
  - Accessibility: alt text on every image, labels linked to every form
    control, fieldset/legend for groups, logical heading order (one h1 then
    h2/h3), colour contrast of at least 4.5:1, base font size 17px, visible
    focus outlines, error messages announced to screen readers.
  - The home page hero image rotates between the dish photos every three
    seconds, and the rotation is skipped when the visitor's device asks for
    reduced motion (prefers-reduced-motion).

How pages work together
  - The restaurant data (name, cuisine, category, prices, deposit, diets,
    purposes) is stored once, at the top of js/script.js, as the RESTAURANTS
    list. The recommendation and reservation pages both read from it, and the
    restaurant pages' content matches it.
  - Choosing a restaurant on the home page, the restaurants page or the
    recommendation results sends the visitor to
    reservation.html?restaurant=<id>. The reservation page reads <id> from the
    address and pre-selects that restaurant. The visitor can change it at any
    time using the drop-down.


----------------------------------------------------
2. EXPLANATION OF THE JAVASCRIPT VALIDATION LOGIC 
----------------------------------------------------
General approach (all forms)
  - The HTML uses the built-in HTML5 constraint attributes where they fit
    (type="email", required, minlength, maxlength, pattern, min, max, step)
    so the rules are documented in the markup itself.
  - Each form also has novalidate, so the browser's own pop-up bubbles are
    switched off and the visitor only ever sees the clear messages written by
    the JavaScript.
  - Each form has one validation function that checks every field with a
    simple block of if-statements (the required check first, then the format
    rules). Each field's message is written into its own error paragraph
    under the field, and the field is marked with aria-invalid.
  - When the visitor presses Submit, every field is checked, a summary box at
    the top asks the visitor to fix the highlighted fields, and the form is
    NOT submitted (event.preventDefault) until every field is valid.

Registration form (register.html) - all fields are required
  - Username: at least 5 characters; only letters, numbers and underscores.
  - Email: must look like name@domain.ext.
  - Phone: digits only, between 8 and 15 digits.
  - Password: at least 10 characters with an uppercase letter, a lowercase
    letter, a number and a special character (validated on submit). "Show/Hide"
    buttons reveal the password.
  - Confirm password: must be filled in and identical to the password.
  - Gender: one option must be selected.
  - Dietary preferences: at least one box must be ticked; "None" cannot be
    combined with other choices (ticking one unticks the other).
  - Country/Region: one must be chosen from the list.

Reservation form (reservation.html)
  - Full name, email, phone, restaurant, date, time, number of people,
    deposit method and billing email may not be empty.
  - Email: valid email format. Phone: only digits, spaces, dashes, brackets and
    a leading +, and at least 10 digits.
  - Date: cannot be earlier than today (the date picker also blocks past
    days). Time: if the date is today, the time must still be in the future.
  - Number of people: a whole number greater than 0 (maximum 30).
  - Deposit: the read-only deposit box is filled in automatically from the
    restaurant data each time the restaurant drop-down changes.
  - Deposit method: Voucher or Online payment must be chosen.
      * Voucher: the 12-digit voucher box appears and the credit card fields
        are hidden and disabled (so they are not sent). The code box only
        accepts digits (maximum 12); as the brief says, it is not validated
        further.
      * Online payment: the credit card fields appear. Card type is required;
        the card number must be digits only and exactly 16 digits for
        Visa/Mastercard or 15 digits for American Express (format check only,
        nothing is processed - use fake numbers). Name on card, expiry (MM/YY,
        not expired) and security code (3 digits, or 4 for Amex) are also
        checked. Fields that are hidden are never validated.
  - "Same as email address": ticking it copies the email into the billing email
    box and keeps it in sync while the email is edited; unticking lets the
    visitor type a different address. The billing email must be a valid email.
  - The form uses method POST and its action is
    http://mercury.swin.edu.au/s104992813/cos10005/regtest.php
    (the Mercury test script for my own login).

Recommendation logic (recommend.html)
  1. Cuisine category is a hard rule: the restaurant must be in the chosen
     category (Arabic, Malaysian, Japanese, Cafe, Desserts, Korean);
     "Any" allows all restaurants.
  2. Diet is a hard rule: only restaurants that cater for the chosen diet
     (halal, vegetarian, vegan) are considered; "None" allows all.
  3. Budget bands (per person): up to RM50, RM51-100, RM101-200, above RM200.
     A restaurant earns 3 points if the middle of its price range falls inside
     the band, 1 point if its range only partly overlaps, and is removed if it
     does not overlap at all.
  4. Dining purpose: +2 points if the restaurant suits family, date or
     business dining. A matched diet adds +1 point.
  5. The top three by score are shown with a match percentage and the reasons.
     If the cuisine, diet and budget cannot all be satisfied (for example vegan
     with "above RM200"), the closest-priced restaurants for that choice are
     shown with an explanatory note instead of an empty page.
  6. Results are radio buttons; the first is pre-selected, and "Reserve
     selected restaurant" opens reservation.html with that restaurant chosen.


------------------------------------------------------------------------------
3. TESTING
------------------------------------------------------------------------------
  - All five HTML pages and css/style.css were checked with the W3C Nu HTML
    Checker (vnu) including its CSS checker: 0 errors, 0 warnings.
    Re-check on https://validator.w3.org and https://jigsaw.w3.org/css-validator
    after you make any change.
  - Form logic, recommendation outcomes, payment toggling and deposit updates
    were tested with scripted test cases covering valid and invalid input.


------------------------------------------------------------------------------
4. KNOWN ISSUES AND LIMITATIONS
------------------------------------------------------------------------------
  - Restaurants, prices and deposits are fictional sample data for this
    assignment; the data is stored in script.js rather than a database.
  - The registration form does not create a real account (front-end only).
  - Voucher codes are not checked for validity, and credit card numbers are only
    format-checked (no real processing), as specified.
  - The date and time pickers look different in different browsers; on very old
    browsers that do not support them, the field becomes a normal text box.
  - The recommendation page returns at most three restaurants.


------------------------------------------------------------------------------
5. REFERENCES AND ACKNOWLEDGEMENTS
------------------------------------------------------------------------------
Images
    checks it and third-party content without a reference loses marks.]
  - images/logo.png        - source: ["made by me"]
  - images/restaurant1.jpg - ORCHID HOUSE Restaurant - source: [Google Map]
  - images/restaurant2.jpg - Nando's Sunway Pyramid - source: [Google Map]
  - images/restaurant3.jpg - Sushi Hiro USJ Taipan - source: [Google Map]
  - images/restaurant4.jpg - Upstairs Cafe SS12 - source: [Google Map]
  - images/restaurant5.jpg - Talker Cafe SS13 - source: [Google Map]
  - images/restaurant6.jpg - Ajooma Pocha SS15 - source: [Google Map]
  - images/index/sushi.jpg     - sushi platter - source: [Google]
  - images/index/shawama.jpg   - shawarma wrap - source: [Google]
  - images/index/lambrice.jpg  - lamb rice dish - source: [Google]
  - images/index/ramen.jpg     - ramen bowl - source: [Google]
  - images/index/kfood.jpg     - Korean food spread - source: [Google]
  - images/index/strawberry.jpg- strawberry dessert - source: [Google]
  - images/index/latte.jpg     - cafe latte - source: [Google]
  - images/index/drinks.jpg    - drinks selection - source: [Google]
  - images/index/hotrice.jpg   - hot rice dish - source: [Google]

Technical references
  - MDN Web Docs (developer.mozilla.org): HTML elements, CSS Grid/Flexbox,
    URLSearchParams, Array methods, regular expressions, ARIA attributes.
  - W3C Web Content Accessibility Guidelines 2.2 (colour contrast, labels,
    focus visibility): https://www.w3.org/TR/WCAG22/
  - W3C Nu HTML Checker: https://validator.w3.org/nu/
  - Fonts: Google Fonts (Montserrat for headings/brand/buttons and Open Sans for body copy/forms/tables) with system fallback stack (Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif).

