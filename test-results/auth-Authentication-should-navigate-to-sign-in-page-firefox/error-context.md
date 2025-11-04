# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e12]
  - generic [ref=e13]:
    - link "DC Digital Cards" [ref=e16] [cursor=pointer]:
      - /url: /
      - generic [ref=e17]: DC
      - generic [ref=e18]: Digital Cards
    - generic [ref=e20]:
      - heading "Sign in to Digital Cards" [level=1] [ref=e21]
      - button "Continue with Google" [ref=e22]:
        - img [ref=e23]
        - generic [ref=e28]: Continue with Google
      - generic [ref=e33]: or sign in with email
      - generic [ref=e34]:
        - generic [ref=e35]:
          - generic [ref=e36]: Email
          - textbox "Email" [ref=e37]:
            - /placeholder: you@example.com
        - generic [ref=e38]:
          - generic [ref=e39]: Password
          - textbox "Password" [ref=e40]:
            - /placeholder: ••••••••
        - button "Sign In" [ref=e41]
      - generic [ref=e42]:
        - text: Don’t have an account?
        - link "Sign up" [ref=e43] [cursor=pointer]:
          - /url: /auth/signup
      - link "← Back to Home" [ref=e45] [cursor=pointer]:
        - /url: /
```