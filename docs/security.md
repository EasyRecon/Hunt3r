# Security

Not being a developer and even if it were, it is not impossible that Hunt3r suffers from security weaknesses.  
If you think you have detected a vulnerability, please contact [Jomar](https://twitter.com/J0_mart) or [Serizao](https://twitter.com/WilliamSerizao).

If you want to check the robustness of Hunt3r, we consider the following to be the most important security issues :

  - Bypass of the login page / JWT Check
  - Lack of control check between a classic user and an administrator
  - Bypass 'hunt3r_token' token control for external requests
  - Bypass of mesh control from outside

The following issues have already been identified but do not represent a direct risk to Hunt3r and will 
be corrected as development continues :

 - Path Traversal : Possible  in 3 different places in the Hunt3r API
    - Limited impact, allows to overwrite some files or to know if a file exists
        - Possibly fixed, no bypass was identified but a second check should be done
- OS Command Injection : Possible to escape the launch of the scan script and inject an arbitrary command
    - Consider as low risk / no impact because the command is executed on a fresh server without data, 
      moreover the script is already initially intended to launch arbitrary commands ...
        - It remains preferable to correct this, for "good practices".