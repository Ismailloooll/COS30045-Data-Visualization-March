# COS30045 – Data Visualisation
## Appliance Energy Consumption Website

---

## Exercise 0.2 – Build Appliance Energy Consumption Website

### Summary
Built a small interactive website about appliance energy consumption in the Australian market using HTML, CSS, and JavaScript.

### Pages built
- **Home** – Overview of household energy consumption in Australia with key facts and statistics
- **Televisions** – Detailed information about TV energy consumption by type and size including a cost comparison table
- **About Us** – Information about the project, developer, data source, data processing and ethics

### Features implemented
- Three page website with JavaScript navigation — no page reloads
- Top navigation menu with active page highlighting
- Mouse hover feedback on navigation links
- Power logo in navigation that returns user to home page
- Cards with icons for visual presentation
- Statistics section with key energy facts
- Data table showing estimated annual TV running costs
- Footer with year, name and GenAI acknowledgement
- CSS styling with green colour scheme
- Responsive layout using CSS Grid

### Tools used
- HTML5
- CSS3
- JavaScript
- Visual Studio Code
- GitHub Desktop
- Live Server extension for local testing

### Folder structure
```
energy-webpage-v1/
├── css/
│   └── styles.css
├── js/
│   └── scripts.js
├── images/
│   └── PowerIcon.png
├── data/
│   └── data.csv
├── index.html
└── README.md
```

---

## Exercise 0.3 – Host Website on Mercury

### Summary
Uploaded the energy consumption website to Swinburne's Mercury Apache server and confirmed it is accessible via browser.

### Steps completed
- Activated COS30045 Mercury account using PuTTY
- Connected to Mercury server using WinSCP
- Uploaded all website files to the correct htdocs directory
- Tested the website is accessible via browser
- Confirmed the website is viewable with Swinburne login

### Live website link
```
http://mercury.swin.edu.au/cos30045/s106407636/energy-webpage-v1/index.html
```

Note: Viewing this page requires a Swinburne University login (student ID and SIMS password).

---

## Exercise 1 – Data Processing with KNIME

### Summary
Used KNIME Analytics Platform to process and clean the Australian Government TV energy consumption dataset in preparation for data visualisation.

### Dataset
- Source: Australian Government TV energy consumption dataset
- File: tv_2026_03_26.csv
- Contains information about television models sold in Australia including brand, model, screen size, technology type, power consumption and star ratings

### Workflow steps
1. **CSV Reader** – Reads the TV energy dataset from CSV file
2. **Duplicate Row Filter** – Removes duplicate TV models, keeps most recent entry based on Model_No
3. **Missing Value** – Handles missing values in the dataset
4. **Row Filter** – Keeps only TV models sold in Australia using regex filter on SoldIn column
5. **Column Filter** – Removes unnecessary columns, keeps only relevant ones for analysis
6. **Math Formula** – Converts screen size from centimetres to inches using formula: screensize / 2.54
7. **Expression** – Groups screen sizes into standard advertised size categories (22, 27, 32, 43, 50, 55, 65, 75, 85 inch)

### Questions the cleaned data can answer
- What TV screen technologies are available in Australia and which are most frequent?
- What screen sizes are available and which are most frequent?
- Which brands have the largest number of models?
- Which screen technology consumes the least power?
- What is the relationship between screen size and power use?
- What is the relationship between star rating and screen size?
- Are there differences in power consumption between brands?

### Files submitted
- `Exercise_1.knwf` — annotated KNIME workflow file
- `workflow_screenshot.png` — screenshot of the complete workflow

---

## GenAI Declaration

### Tools used
- **Claude (Anthropic)** – Used via claude.ai
- **GitHub Copilot** – Available through GitHub Education

### How GenAI was used

**Exercise 0.2 and 0.3:**
- Generating the initial HTML structure and page layout
- Writing and formatting CSS styles including navigation bar, cards, stats section and table
- Writing JavaScript for page navigation and active link highlighting
- Suggesting content and text for the energy consumption topic
- Debugging issues such as CSS not loading due to incorrect file naming
- Explaining how to set up folder structure and GitHub workflow
- Providing step by step guidance for uploading files to Mercury server

**Exercise 1:**
- Explaining how to use KNIME nodes and configure settings
- Suggesting the correct workflow order for data cleaning
- Writing the nested if expression for screen size categories
- Helping debug syntax errors in KNIME expressions
- Explaining how to configure Row Filter, Duplicate Row Filter and Expression nodes

### Reflection
Using GenAI tools significantly sped up the development process, especially for repetitive tasks like writing CSS, setting up HTML structure, and configuring KNIME nodes. However, it was important to review and understand every piece of code and configuration generated, as some suggestions required modification to work correctly.

For example, the CSS file was initially named incorrectly and had to be fixed manually. The KNIME Expression node required debugging as the syntax for nested if statements is different from standard programming. These experiences showed that GenAI does not always account for the specific environment or file structure of a project and requires careful review.

Overall, GenAI was a useful assistant but not a replacement for understanding the work. All generated content was reviewed, tested, and modified where necessary.

### Commits involving GenAI-generated code
All commits in this repository involved code or configurations that were assisted or generated by GenAI tools. Key commits include:
- Initial HTML structure and CSS styling
- JavaScript navigation functionality
- Content updates and bug fixes
- KNIME workflow configuration and expression writing

---

*COS30045 Data Visualisation – Swinburne University of Technology – 2025*
*Student ID: s106407636*