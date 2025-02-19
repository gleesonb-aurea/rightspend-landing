

| Document Purpose |
| :---- |
| This document outlines the configuration parameters supported by CloudFix RightSpend. |

| Common Configuration Parameters |  |
| :---- | :---- |
| **Parameter** | **Description** |
| **AllowedRegions** | Specifies the list of AWS regions where RightSpend is permitted to modify Convertible Reserved Instances (cRIs). |
| **AllowedAccounts** | Specifies the list of AWS accounts where RightSpend is permitted to modify cRIs. |
| **AllowedPlatforms** | Specifies the list of platforms that RightSpend is allowed to cover. “All” by default. |
| **AllowLongDeferral** | By default, RightSpend only defers cRIs  to the next available date after the nearest expiration for each account-region. When enabled, this parameter allows deferral to the latest possible date within the "MaxExchangeDays" period (see below). |
| **AllUpfrontDays** | AWS offers a 5-10% higher discount for cRIs that are paid fully upfront. This setting makes RightSpend upgrade cRIs to all-upfront when they have fewer than the specified number of days remaining before expiration. This results in AWS immediately charging the upfront fee for the remaining time until expiration. |
| **Buffer** | Specifies the dollar-per-hour amount ($/hr) to leave running as on-demand usage. This helps reduce the chance of unused Compute Savings Plans (SPs). |
| **MaxExchangeDays** | Specifies the maximum number of days until expiration for cRIs that RightSpend is allowed to modify. |
| **RecentEC2CutOff** | Some EC2 instances are launched for short durations (e.g., batch processing jobs). It's more efficient to let AWS allocate Savings Plans (SPs) for these instances instead of converting them to cRIs. This parameter instructs RightSpend to ignore EC2 instances started less than the specified number of minutes ago. The default value is 1440 minutes (1 day). |
| **LazyThreshold** | Most cRI operations slightly increase total commitment due to AWS true-up rules. Additionally, some operations can span multiple hours, potentially resulting in interim cRIs that cross hour boundaries, leading to unused cRIs and reduced coverage. This parameter allows RightSpend to skip optimization runs for specific hours if the expected savings gain falls below the defined threshold. Default: 0.01%. |

| Per-Region Configuration Parameters |  |
| :---- | :---- |
| **Parameter** | **Description** |
| **MaxHourlyCommitment** | Maximum $/hr of all cRIs in this region across all accounts, including the ones not listed in AllowedAccounts. For Partial Upfront and All Upfront cRIs an effective rate is used. |
| **MaxTotalCommitment** | Total commitment is calculated as hourly commitment multiplied by the number of hours to expiration. This parameter sets the maximum total cRI commitment for a particular region across all accounts, including the ones not listed in AllowedAccounts.  |
| **DecreaseRate** | The speed of decreasing the cRI commitment when overcommitted. |
| **IncreaseRate** | The speed of increasing the cRI commitment when there’s on-demand spend. |
| **ReactToSPDiff** | Enables RightSpend to make sharp changes to commitment during the hour following modifications to the structure of Savings Plans (SPs) in the Org. These modifications may include new SP purchases, SP expirations, or the addition/removal of AWS accounts containing SPs within the organization. |

