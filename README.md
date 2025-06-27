# Bogamon

This captcha is a timed bitcoin-capturing game. The goal is to debilitate the bitcoin and capture it with your wallet before your own health runs out.

## Settings

There are a couple settings that can be tweaked in [`captcha/captcha.js`](./captcha/captcha.js):

| Setting                           | Description                                                               |
| --------------------------------- | ------------------------------------------------------------------------- |
| `TIME_SECONDS`                    | How long you have to capture the bitcoin.                                 |
| `ATTACK_CHANCE`                   | How likely each attack is to land.                                        |
| `ATTACK_VALUE`                    | How much damage (percentage of the bitcoin health) the attack does.       |
| `CAPTURE_CHANCE`                  | Chance of capturing the bitcoin depending on its health.                  |
| `STOP_HEALTH_DECREASE_ON_CAPTURE` | Whether your health should stop depleting when the capture is successful. |
| `FORCE_CAPTURING`                 | For debugging only: make capturing always succeed.                        |

## Third Party

- The bitcoin 'logo' (₿) is public domain.
- The font used is by [Kenney](https://kenney.nl/) (CC0 license).
