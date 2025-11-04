# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e13]
  - generic [ref=e14]:
    - link "DC Digital Cards" [ref=e17]:
      - /url: /
      - generic [ref=e18]: DC
      - generic [ref=e19]: Digital Cards
    - generic [ref=e21]:
      - heading "Sign in to Digital Cards" [level=1] [ref=e22]
      - button "Continue with Google" [ref=e23]:
        - img [ref=e24]
        - generic [ref=e29]: Continue with Google
      - generic [ref=e34]: or sign in with email
      - generic [ref=e35]:
        - generic [ref=e36]:
          - generic [ref=e37]: Email
          - textbox "Email" [ref=e38]:
            - /placeholder: you@example.com
        - generic [ref=e39]:
          - generic [ref=e40]: Password
          - textbox "Password" [ref=e41]:
            - /placeholder: ••••••••
        - button "Sign In" [ref=e42]
      - generic [ref=e43]:
        - text: Don’t have an account?
        - link "Sign up" [ref=e44]:
          - /url: /auth/signup
      - link "← Back to Home" [ref=e46]:
        - /url: /
```