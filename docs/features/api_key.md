# External API Key

Currently external third party servers are used in Hunt3r and therefore require an API key: 

```json
{
	"dehashed": [
		"user",
		"api_key"
	],
	"c99": [
		"api_key"
	],
	"whoxy": [
		"api_key"
	],
	"slack": [
		"webhook"
	],
	"interactsh": [
		"url",
		"api_key"
	]
}
```

When adding one of these services, a validity check will be performed. Depending on the service, it may consume a credit.

This is the case of Dehashed & Whoxy, however, then when launching a scan no verification will be done, so it is your 
responsibility to make sure you have the necessary credits before launching a scan.