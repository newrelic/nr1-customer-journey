# nr1-customer-journey

![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/newrelic/nr1-customer-journey?include_prereleases&sort=semver) ![AppVeyor](https://img.shields.io/appveyor/ci/newrelic/nr1-customer-journey) [![Snyk](https://snyk.io/test/github/newrelic/nr1-customer-journey/badge.svg)](https://snyk.io/test/github/newrelic/nr1-customer-journey)

## Usage

nr1-customer-journey is like a [NRQL funnel query](https://docs.newrelic.com/docs/query-data/nrql-new-relic-query-language/nrql-query-examples/funnels-evaluate-data-series-events) on steroids. It leverages a `nr1=funnel-component` to align multiple cohorts of data into a common funnel next to cohort (column) and step (row) metrics. Each `chevron` is clickable to access the timeseries data of that given step and cohort.

Currently, the application is driven by a relatively complex JSON config file. The documentation for that configuration file is available [here](CONFIG.md).

![Screenshot #1](screenshots/screenshot_01.png)
![Screenshot #2](screenshots/screenshot_02.png)
![Screenshot #3](screenshots/screenshot_03.png)

## Open Source License

This project is distributed under the [Apache 2 license](blob/master/LICENSE).

## What do you need to make this work?

1. Access to [New Relic One](https://newrelic.com/platform).
2. Configuring the [journeyConfig.js](journeyConfig.js).

### Configuring this Nerdpack

See [CONFIG.md](CONFIG.md) for detailed instructions on the capabilities of each portion of the [journeyConfig.js](journeyConfig.js). Also look at the [examples](examples) directory for inspiration.

## Getting started

Clone this repository and run the following scripts:

```bash
git clone https://github.com/newrelic/nr1-customer-journey.git
cd nr1-customer-journey
npm install
npm start
```

Visit [https://one.newrelic.com/?nerdpacks=local](https://one.newrelic.com/?nerdpacks=local), navigate to the Nerdpack, and :sparkles:

## Deploying this Nerdpack

Open a command prompt in the nerdpack's directory and run the following commands.

```bash
# this is to create a new uuid for the nerdpack so that you can deploy it to your account
nr1 nerdpack:uuid -g [--profile=your_profile_name]
# to see a list of APIkeys / profiles available in your development environment, run nr1 credentials:list
nr1 nerdpack:publish [--profile=your_profile_name]
nr1 nerdpack:deploy [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
nr1 nerdpack:subscribe [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
```

Visit [https://one.newrelic.com](https://one.newrelic.com), navigate to the Nerdpack, and :sparkles:

## Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR SUPPORT, although you can report issues and contribute to the project here on GitHub.

_Please do not report issues with this software to New Relic Global Technical Support._

### Community

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorer's Hub. You can find this project's topic/threads here:

[https://discuss.newrelic.com/c/build-on-new-relic/nr1-customer-journey](https://discuss.newrelic.com/c/build-on-new-relic/nr1-customer-journey)
*(Note: URL subject to change before GA)*

### Issues / Enhancement Requests

Issues and enhancement requests can be submitted in the [Issues tab of this repository](../../issues). Please search for and review the existing open issues before submitting a new issue.

## Contributing

Contributions are welcome (and if you submit a Enhancement Request, expect to be invited to contribute it yourself :grin:). Please review our [Contributors Guide](CONTRIBUTING.md).

Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. If you'd like to execute our corporate CLA, or if you have any questions, please drop us an email at opensource@newrelic.com.
