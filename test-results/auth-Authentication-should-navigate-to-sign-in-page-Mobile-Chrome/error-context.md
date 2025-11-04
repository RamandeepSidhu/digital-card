# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e12]:
    - link "DC Digital Cards" [ref=e15] [cursor=pointer]:
      - /url: /
      - generic [ref=e16]: DC
      - generic [ref=e17]: Digital Cards
    - generic [ref=e19]:
      - heading "Sign in to Digital Cards" [level=1] [ref=e20]
      - button "Continue with Google" [ref=e21]:
        - img [ref=e22]
        - generic [ref=e27]: Continue with Google
      - generic [ref=e32]: or sign in with email
      - generic [ref=e33]:
        - generic [ref=e34]:
          - generic [ref=e35]: Email
          - textbox "Email" [ref=e36]:
            - /placeholder: you@example.com
        - generic [ref=e37]:
          - generic [ref=e38]: Password
          - textbox "Password" [ref=e39]:
            - /placeholder: ••••••••
        - button "Sign In" [ref=e40]
      - generic [ref=e41]:
        - text: Don’t have an account?
        - link "Sign up" [ref=e42] [cursor=pointer]:
          - /url: /auth/signup
      - link "← Back to Home" [ref=e44] [cursor=pointer]:
        - /url: /
```