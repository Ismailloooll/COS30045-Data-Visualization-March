# COS30045 – Data Visualisation
## TV Energy Consumption Website

**Student ID:** s106407636  
**University:** Swinburne University of Technology  
**Year:** 2026

**Exercise 3 Data Story Website:** http://mercury.swin.edu.au/cos30045/s106407636/exercise3/index.html

**GitHub Repository:** https://github.com/Ismailloooll/COS30045-Data-Visualization-March

---

## Data Story

This project presents a data story about television energy consumption in Australia, designed for researchers studying energy efficiency in consumer electronics. The story was built using HTML, CSS, JavaScript, and D3.js, with data sourced from the Australian Government energy rating dataset and cleaned using KNIME Analytics Platform.

The target audience for this visualisation is researchers who require accurate, data-driven insights with appropriate context and statistical transparency. They are interested in understanding market-level patterns in TV energy consumption, identifying which technologies and brands dominate the Australian market, and exploring the physical factors that drive energy use in televisions.

The data story follows a structured narrative arc. It begins by introducing the issue — that TV energy consumption is a significant but often overlooked contributor to household electricity use in Australia. It then demonstrates the scale and diversity of the Australian TV market, showing how many models are available and which screen technologies dominate. From there it identifies which brands have the largest market presence and explores the relationship between screen size and power consumption. The story concludes with research recommendations based on the findings.

Three key findings are presented. The first finding is that LCD (LED) technology dominates the Australian TV market, accounting for over 80% of all currently available models. This has significant implications for research design, as any study of Australian TV energy consumption must account for this concentration. The second finding is that a small number of brands including Hisense, Samsung, LG, and Sony collectively dominate the available models in Australia. This market concentration means that policy interventions or research partnerships with just a handful of manufacturers could have an outsized effect on the overall energy efficiency of the market. The third finding is that screen size is a strong positive predictor of power consumption, with a clear relationship visible from 22-inch to 85-inch models. However, significant variation within each size category suggests that technology choices and manufacturing efficiency also play important roles beyond physical size alone.

---

## About the Data

The dataset used in this project was published by the Australian Government and contains information about the energy consumption of televisions sold in Australia. The file tv_2026_03_26.csv was downloaded from the Australian Government energy rating website and contains over 5,000 rows covering TV models registered for sale in the Australian market across 32 columns including brand name, model number, screen technology, screen size in centimetres, average power consumption in watts, and energy star rating.

Before visualisation, the dataset was cleaned using KNIME Analytics Platform. Duplicate model entries were removed, keeping the most recent submission for each model. Rows with missing values in key columns were handled appropriately. The dataset was filtered to include only currently available models sold in Australia. Unnecessary columns were removed to focus the analysis on relevant attributes. Brand names were standardised to uppercase to resolve inconsistencies such as Samsung and SAMSUNG being treated as different brands. Screen size was converted from centimetres to inches and grouped into standard advertised size categories such as 32 inch, 55 inch, and 65 inch.

The dataset contains no personal or sensitive information. It focuses solely on product specifications and energy consumption data related to television devices registered with the Australian Government energy rating scheme, meaning there are no privacy concerns associated with its use or publication.

While the dataset provides useful information about TV energy consumption in Australia, there are some limitations to consider. The dataset may not include all available television models, and some information may be outdated or incomplete as registration data is updated periodically. Energy consumption in real-world conditions may also vary depending on factors such as brightness settings, content type, and ambient temperature, which are not captured in the dataset. These limitations should be considered when interpreting the visualisations presented on the website.

This project follows ethical data visualisation practices throughout. All chart axes start at zero to avoid misleading visual comparisons. Data limitations are clearly disclosed on the website. The context of the data is explained so that viewers can interpret the results correctly. No personal data is presented or stored at any point.

---

## GenAI Declaration

AI tools were used to help brainstorm ideas and suggest approaches during the development of this project. All code, content, and decisions were written and reviewed by the developer.

---

*COS30045 Data Visualisation – Swinburne University of Technology – 2025*