## Overview

`nr1-customer-journey` is like a [NRQL funnel query](https://docs.newrelic.com/docs/query-data/nrql-new-relic-query-language/nrql-query-examples/funnels-evaluate-data-series-events) on steroids. The Nerdpack is designed to allow devops teams, product manager, and digital marketers to examine a number of pre-defined measures in a side-by-side comparison between cohorts (columns) of users through a set of steps (rows).

* Rows = Steps
* Columns = Series
* Measures = Stats

The application does this through a few visualizations.

### Multi-series Funnel

It leverages a [`nr1-funnel-component`](https://github.com/newrelic/nr1-funnel-component). This visualization combines a 3rd party funnel library with the NR1 `NerdGraphQuery` component to execute three New Relic `NRQL` queries in the same GraphQL request and align the results into one data set that is delivered to the funnel visualization.

### Data panels

For each row (Step) and column (Series), the Nerdpack renders a set of measurements (Stat). Those calculations can apply KPI thresholds to color-code the information. Each panel is also `clickable`, leading to a more detailed overview.

### Detail Nerdlet

For any `Journey`, `Series`, and `Step`, there's a Nerdlet that will display the more detailed KPI's as well as timeseries view of the the given `Stats` for the selected row and column.

## Usage

Currently, the application is driven by a relatively complex JSON config file. The documentation for that configuration file is available [here](https://github.com/newrelic/nr1-customer-journey/blob/master/CONFIG.md).

## Open Source License

This project is distributed under the [Apache 2 license](https://github.com/newrelic/nr1-customer-journey/blob/master/LICENSE).

## What do you need to make this work?

1. Access to [New Relic One](https://newrelic.com/platform).
2. Configuring the [journeyConfig.js](https://github.com/newrelic/nr1-customer-journey/blob/master/journeyConfig.js).

### Configuring this Nerdpack

See [CONFIG.md](https://github.com/newrelic/nr1-customer-journey/blob/master/CONFIG.md) for detailed instructions on the capabilities of each portion of the [journeyConfig.js](https://github.com/newrelic/nr1-customer-journey/blob/master/journeyConfig.js). Also look at the [examples](https://github.com/newrelic/nr1-customer-journey/tree/master/examples) directory for inspiration.

## Getting started

First, ensure that you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [NPM](https://www.npmjs.com/get-npm) installed. If you're unsure whether you have one or both of them installed, run the following command(s) (If you have them installed these commands will return a version number, if not, the commands won't be recognized):

```bash
git --version
npm -v
```

Next, install the [NR1 CLI](https://one.newrelic.com/launcher/developer-center.launcher) by going to [this link](https://one.newrelic.com/launcher/developer-center.launcher) and following the instructions (5 minutes or less) to install and setup your New Relic development environment.

Next, to clone this repository and run the code locally against your New Relic data, execute the following command:

```bash
nr1 nerdpack:clone -r https://github.com/newrelic/nr1-customer-journey.git
cd nr1-customer-journey
nr1 nerdpack:serve
```

Visit [https://one.newrelic.com/?nerdpacks=local](https://one.newrelic.com/?nerdpacks=local), navigate to the Nerdpack, and :sparkles:

## Deploying this Nerdpack

Open a command prompt in the nerdpack's directory and run the following commands.

```bash
# To create a new uuid for the nerdpack so that you can deploy it to your account:
# nr1 nerdpack:uuid -g [--profile=your_profile_name]
# To see a list of APIkeys / profiles available in your development environment:
# nr1 profiles:list
nr1 nerdpack:publish [--profile=your_profile_name]
nr1 nerdpack:deploy [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
nr1 nerdpack:subscribe [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
```

Visit [https://one.newrelic.com](https://one.newrelic.com), navigate to the Nerdpack, and :sparkles:

## Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR SUPPORT, although you can report issues and contribute to the project here on GitHub.

_Please do not report issues with this software to New Relic Global Technical Support._

### Community

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

https://discuss.newrelic.com/t/customer-journey-nerdpack/83270
*(Note: URL subject to change before GA)*

### Issues / Enhancement Requests

Issues and enhancement requests can be submitted in the [Issues tab of this repository](https://github.com/newrelic/nr1-customer-journey/issues). Please search for and review the existing open issues before submitting a new issue.

## Contributing

Contributions are welcome (and if you submit a Enhancement Request, expect to be invited to contribute it yourself :grin:). Please review our [Contributors Guide](https://github.com/newrelic/nr1-customer-journey/blob/master/CONTRIBUTING.md).

Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. If you'd like to execute our corporate CLA, or if you have any questions, please drop us an email at opensource@newrelic.com.