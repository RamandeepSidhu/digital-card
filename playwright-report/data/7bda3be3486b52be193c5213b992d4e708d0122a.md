# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - link "DC Digital Cards" [ref=e5]:
      - /url: /
      - generic [ref=e6]: DC
      - generic [ref=e7]: Digital Cards
    - generic [ref=e9]:
      - heading "Sign in to Digital Cards" [level=1] [ref=e10]
      - button "Continue with Google" [ref=e11]:
        - img [ref=e12]
        - generic [ref=e17]: Continue with Google
      - generic [ref=e22]: or sign in with email
      - generic [ref=e23]:
        - generic [ref=e24]:
          - generic [ref=e25]: Email
          - textbox "Email" [active] [ref=e26]:
            - /placeholder: you@example.com
        - generic [ref=e27]:
          - generic [ref=e28]: Password
          - textbox "Password" [ref=e29]:
            - /placeholder: ••••••••
            - text: wrongpassword
        - button "Sign In" [ref=e30]
      - generic [ref=e31]:
        - text: Don’t have an account?
        - link "Sign up" [ref=e32]:
          - /url: /auth/signup
      - link "← Back to Home" [ref=e34]:
        - /url: /
  - button "Open Next.js Dev Tools" [ref=e40] [cursor=pointer]:
    - img [ref=e41]
  - alert [ref=e46]
```