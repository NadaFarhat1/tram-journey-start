# Remix of Remix of TRAM Connect

TRAM — Complete Lovable AI Prompt

Build a responsive web application called TRAM with the exact pages, navigation flow, UI behavior, validation, and design system described below.

Do not add features, pages, sections, text, or UI elements that are not explicitly requested.

1. CORE USER FLOW

First Page

The first page must always be the Login Page.

Existing User

User enters Email/Phone and Password.

User clicks Sign In.

Validate the credentials.

If credentials are correct:

Go directly to the Home Page.

Do NOT show the Leader Page.

Do NOT show the Member Page.

Do NOT ask the user to select a role again.

If credentials are incorrect, show:
Invalid email/phone or password

New User

Login Page → Sign Up

User creates an account.

User selects either:

Leader

Member

After successful registration:

Show toast: Account created successfully

Return to Login Page.

User logs in with the newly created account.

If role = Leader → open Leader Page.

If role = Member → open Member Page.

2. LOGIN PAGE

Layout

Desktop: approximately 60% form area + 40% visual area.

The visual area should be on the right.

Mobile: visual area above, form area below.

Tablet: adapt naturally and responsively.

Keep the layout clean and balanced.

Form Content

Title

Welcome Back

Subtitle

Your journey with TRAM continues here.

Email/Phone

Placeholder:
Enter your email or phone

Password

Placeholder:
Enter your password

Requirements:

Password visibility eye icon only.

Do NOT use a lock icon.

Eye icon toggles between show/hide password.

Forgot Password

Place directly below the password field.

Text:
Forgot your password?

Right/end aligned.

Only the text is clickable.

Opens the Forgot Password Page.

Sign In Button

Text:
Sign In

Requirements:

Center the button.

Approximately 35–40% of the form width on desktop.

Responsive on smaller screens.

On submission:

Show Signing in...

Show a spinner.

Disable the button to prevent repeated submissions.

Sign Up Link

Below the button, centered:

Don't have an account? Sign Up

Only Sign Up is clickable.

Error

For invalid login:
Invalid email/phone or password

Use a clear but elegant error state.

Animation

Use a subtle, elegant entrance animation.

Do not use excessive motion.

3. SIGN UP PAGE

Layout

Desktop: approximately 60% form area on the LEFT + 40% visual area on the RIGHT.

Mirror the Login Page layout.

Mobile: visual area above, form below.

Tablet: adapt naturally.

The visual section must contain an abstract geometric visual only.

Do NOT place the TRAM logo inside the visual section.

Form

Title

Create Your Account

Subtitle

Join TRAM and get started.

Desktop Field Arrangement

Row 1:

First Name | Last Name

Row 2:

Email | Phone

Row 3:

Password | Confirm Password

Row 4:

Role — full width

Then:

Register button

On mobile, fields become one per row.

Use floating labels.

Password

Requirements:

Minimum 8 characters.

Must contain letters and numbers.

No lock icon.

Eye visibility icon only.

Add a small information/help icon near the password field.

When clicked, show a tooltip/popover containing the password rules.

Do not permanently display the rules.

Phone

The phone field must contain a responsive country-code selector.

Requirements:

The selector must work properly on:

Desktop

Tablet

Mobile

It must remain aligned, usable, and accessible at all screen sizes.

Include countries with their phone codes, for example:

Egypt +20

United States +1

United Kingdom +44

After selecting a country, the phone field must display the selected country code only, such as:
+20

Do NOT display the country name inside the selected phone field.

The country selector and phone input must remain usable without breaking the responsive layout.

Role

Dropdown options must be exactly:

Leader

Member

Save the selected role with the account.

Register Button

Text:
Register

Requirements:

Use the same overall TRAM design system as Sign In.

It may have a slightly different visual treatment from Sign In while remaining consistent with the TRAM identity.

On submission:

Show Creating account...

Show spinner.

Disable the button to prevent repeated submissions.

On success:

Show toast: Account created successfully

Return to Login Page.

Validation

Validate:

Required fields.

Valid email.

Valid phone.

Password rules.

Password confirmation must match.

Role must be selected.

Show validation errors directly below the relevant fields.

Use clear focus and error states.

Login Link

At the bottom:

Already have an account? Log in

Only Log in is clickable.

4. FORGOT PASSWORD PAGE

Create an independent Forgot Password Page.

Keep it simple.

Title

Forgot your password?

Content

Email input.

Appropriate email placeholder.

Submit button.

The form should send a password-reset link to the user's email.

Provide a simple way to return to the Login Page.

Do not add unnecessary features.

5. LEADER PAGE

This page is shown only to a newly registered user whose saved role is Leader, after logging in for the first time.

Do not show a header.

Do not show navigation.

Do not add extra elements.

Center the content horizontally and vertically.

The page must be responsive on:

Desktop

Tablet

Mobile

Content

Heading

Let’s get started.

Subtitle

Your next project starts here.

Project Name Input

Placeholder:
Project Name

Add a small help/info icon near the Project Name field.

When clicked, show a tooltip/popover containing EXACTLY:

Project name must start with a letter.

You can use letters and numbers after that.

Example: Project123

Do not add any other examples.

Project Name Validation

There is NO maximum length requirement.

Rules:

The first character must be a letter.

After the first character, letters and numbers are allowed.

A number cannot be the first character.

If the first character is invalid:
Project name must start with a letter.

If empty:
Please enter a project name.

Create Project Button

Text:
Create Project

On valid submission:

Show Creating project...

Show spinner.

Disable the button to prevent repeated submissions.

Create the project.

Navigate to the Home Page.

6. MEMBER PAGE

This page is shown only to a newly registered user whose saved role is Member, after logging in for the first time.

Keep this page extremely simple.

Do not show:

Header

Navigation

Extra sections

Extra instructions

Help icons

Unnecessary UI

Center everything horizontally and vertically.

The page must be responsive on:

Desktop

Tablet

Mobile

Content

Heading

Ready to join

Subtitle

Enter your project ID and join your team.

Project ID Input

Placeholder:
Enter project ID

There are no special format requirements.

Do not add a help icon.

Join Button

Text:
Join to Project

If the Project ID is invalid or does not exist:
Project ID not found.

If valid:

Show Joining project...

Show spinner.

Disable the button to prevent repeated submissions.

Add the member to the project.

Navigate to the Home Page.

7. HOME PAGE

The Home Page must contain ONLY:

Welcome to Home Page

Center this text horizontally and vertically.

Do NOT add:

Header

Navigation

Sidebar

Cards

Dashboard

Buttons

Profile

Logout

Project information

Additional text

Extra UI

Decorative sections

Nothing else should appear on this page.

8. TRAM DESIGN SYSTEM

The design direction is:

Simple + Creative + Different + Professional + Elegant

The design should feel:

Human-designed

Modern

Youthful

Premium

Clean

Creative

Memorable

Avoid making the application look like a generic AI-generated SaaS dashboard.

Do not use:

Typical blue + indigo AI/SaaS palettes

Dull generic colors

Excessive gradients

Excessive glassmorphism

Excessive rounded cards

Futuristic AI styling

Neon colors

Childish colors

Chaotic decoration

Excessive animation

9. FINAL COLOR PALETTE

The main visual base must be white / warm white.

The color system should be subtle, elegant, and sophisticated.

Do not make the interface feel colorful everywhere.

Use color selectively.

Base Colors

Warm White

#FAF9F6

Primary background color.

Use for:

Main page backgrounds

Form areas

Large clean spaces

Soft Ivory

#F3F1EC

Use for:

Very subtle secondary backgrounds

Input backgrounds when appropriate

Soft sections

Supporting surfaces

Primary Color

Soft Deep Teal

#397A78

This is the main TRAM brand color.

Use for:

Primary buttons

Active states

Important interactive elements

Selected states

Key icons

Some elements in the visual section

The Teal must remain soft and sophisticated.

Do not make it overly dark or overly saturated.

Secondary Teal

Light Teal

#6FA6A2

Use for:

Secondary visual elements

Supporting icons

Small decorative details

Secondary states

Subtle visual hierarchy

Pale Teal

#DCEBE9

Use for:

Very light highlights

Subtle backgrounds

Soft selected states

Small visual accents

Accent Color

Muted Gold

#C5A46D

Use this very selectively.

It should act as a premium accent rather than a dominant color.

Use for:

Small highlights

Tiny visual details

Important decorative accents

Subtle hover details where appropriate

Small elements inside the visual section

Do NOT use the gold excessively.

Do NOT turn the interface into a gold-heavy luxury design.

Text Colors

Deep Charcoal

#292D2D

Use for:

Main headings

Primary text

Important labels

High-priority content

Avoid pure black.

Warm Gray

#777B78

Use for:

Secondary text

Supporting text

Placeholders

Less important information

State Colors

Soft Green

#5F9274

Use for:

Success states

Success messages

Successful registration feedback

Muted Red

#B86B68

Use for:

Error messages

Validation errors

Invalid input states

Keep both state colors soft and consistent with the overall palette.

10. SPLIT DESIGN COLOR USAGE

The Split Design is an important part of the TRAM visual identity.

Login Page

Approximately:

60% Form

Warm White

Soft Ivory

Deep Charcoal

Soft Deep Teal for primary interactions

Muted Gold only for very small accents

40% Visual

Soft Deep Teal as the main visual color

Light Teal and Pale Teal for secondary visual layers

Warm White / Ivory for balance

Small Muted Gold accents

Sign Up Page

Mirror the Login Page:

60% Form on the LEFT

Warm White

Soft Ivory

Deep Charcoal

Soft Deep Teal for primary interactions

Minimal Muted Gold accents

40% Visual on the RIGHT

Soft Deep Teal

Light Teal

Pale Teal

Warm White / Ivory

Very subtle Muted Gold accents

The visual side should feel connected to the form side without simply becoming a flat solid-color block.

Avoid aggressive gradients.

If gradients are used at all, they must be extremely subtle and based only on the approved palette.

11. SHARED UI STYLE

Keep the same design language across all pages.

Use:

Consistent typography

Consistent spacing

Consistent input styling

Consistent floating labels

Consistent border radius

Consistent shadow language

Consistent icon style

Consistent focus states

Consistent error states

Consistent success states

Consistent loading states

Inputs should feel clean and premium, not overly rounded or oversized.

Buttons should feel refined and intentional.

The Leader and Member buttons may have small page-specific differences while still belonging to the same TRAM design system.

12. RESPONSIVENESS

The entire application must be fully responsive.

Support:

Desktop

Tablet

Mobile

Every interactive component must work correctly at every screen size, including:

Country-code selector

Phone input

Role dropdown

Tooltips

Password visibility toggle

Buttons

Loading states

Error states

Form validation

Do not create any feature that works only on one device type.

Avoid horizontal overflow.

Forms must remain comfortable and readable on small screens.

The Split Design must adapt naturally on smaller screens.

13. ACCESSIBILITY

Use:

Readable typography

Strong but elegant contrast

Visible focus states

Clear validation messages

Accessible interactive elements

Appropriate labels

Keyboard-friendly controls

Ensure the approved color palette maintains sufficient text contrast.

Do not rely only on color to communicate errors or success.

14. AUTHENTICATION & DATA

Implement real functional authentication and project data handling.

User account data should include:

First Name

Last Name

Email

Phone

Password/authentication credentials

Role

Role must be saved as either:

Leader

Member

Project data should include:

Project Name

Project ID

Leader association

Members association

Project IDs must be unique.

When a Member enters a Project ID, validate that the project exists before allowing the member to join.

Existing authenticated users who log in successfully must go directly to the Home Page.

Only newly registered users should go through the Leader or Member setup flow.

15. IMPORTANT IMPLEMENTATION RULES

Do not add:

Social login

Remember Me

Extra pages

Extra dashboard components

Extra navigation

Unrequested features

Unrequested text

Unrequested illustrations

Unrequested cards

Unrequested profile sections

Unrequested project information

Do not change the approved wording.

Do not change the approved navigation flow.

Do not ask the user to choose a role again during login.

Do not send existing valid users to the Leader or Member setup pages.

Do not add examples to the Leader Project Name tooltip other than:

Example: Project123

The Home Page must remain exactly as specified.

The visual style must remain elegant, clean, creative, and human-designed.

Use the approved color palette consistently throughout the entire application.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://tram-journey-start.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/95dc7fe7-bfa0-43b4-8ea5-acf649079b12).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
