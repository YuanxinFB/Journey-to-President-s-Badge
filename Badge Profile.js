document.addEventListener('DOMContentLoaded', function () {
    side_baropen();

    const gridToggleBtn = document.getElementById("gridToggleBtn");
    const utilityDock = document.querySelector(".utility-dock");

    gridToggleBtn.addEventListener("click", () => {
        utilityDock.classList.toggle("active");
        gridToggleBtn.classList.toggle("active");
    });

    const hamburgerBtn = document.getElementById("mobile-menu-btn");
    const mobileNav = document.getElementById("mobile-nav");
    const closeMobileNav = document.getElementById("closeMobileNav");

    hamburgerBtn.addEventListener("click", () => {
    mobileNav.classList.add("active");
    hamburgerBtn.style.display = "none";
    document.body.classList.add("sidebar-open");
    });

    closeMobileNav.addEventListener("click", () => {
    mobileNav.classList.remove("active");
    hamburgerBtn.style.display = "block";
    document.body.classList.remove("sidebar-open");
    });
    
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const link = item.querySelector('a');
            if (link.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
    
    const upButton = document.querySelector('.fa-up-long');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            upButton.classList.add('show');
        } else {
            upButton.classList.remove('show');
        }
    });

    upButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.getElementById('toggleSidebar').addEventListener('click', toggleSidebar);

    const subMenus = document.querySelectorAll('.sub-menu, .sub-menu1, .sub-menu2, .sub-menu3, .sub-menu4, .sub-menu-right1, .sub-menu-right2, .sub-menu-right3');
    subMenus.forEach(subMenu => subMenu.style.display = 'none');

    document.addEventListener('change', function (event) {
        const targetCheckbox = event.target.closest('.checkbox, .right-checkbox');
        if (targetCheckbox) {
            updateCheckboxState(targetCheckbox);
        }
        
        const isTargetBadge = event.target.closest('.sub-item[data-url="image/Right/Target.png"] .checkbox');
        if (isTargetBadge) {
            handleTargetBadgeChange(isTargetBadge);
        }
    });
        
    function handleTargetBadgeChange(targetCheckbox) {
        if (!targetCheckbox.checked) {
            document.querySelectorAll('.checkbox, .right-checkbox').forEach(cb => {
                cb.checked = false;
            });

            document.querySelectorAll('.president-container-box').forEach(box => {
                const title = box.getAttribute('title');
                if (
                    title === "NCO PROFICIENCY" ||
                    title === "THREE YEAR SERVICE BADGE" ||
                    title === "NCO in the Company"
                ) {
                    return; 
                }

            });

            updateOverallProgress();
        }
    }

    function updateCheckboxState(checkbox) {
        const targetCheckbox = document.querySelector('.sub-item[data-url="image/Right/Target.png"] .checkbox');
        
        if (!targetCheckbox) {
            console.error("Target Badge checkbox not found.");
            return;
        }
        
        const allCheckboxes = document.querySelectorAll('.checkbox, .right-checkbox');
        
        if (!targetCheckbox.checked) {
            allCheckboxes.forEach(cb => {
                if (cb !== targetCheckbox) {
                    cb.checked = false;
                }
            });

            if (checkbox !== targetCheckbox && (checkbox.classList.contains('checkbox') || checkbox.classList.contains('right-checkbox'))) {
                showCustomAlert("You must check the Target Badge first before selecting any other badges.");
            }
            return;
        }

        const subBox = checkbox.closest('.sub-item');
        const checkboxesInSubBox = subBox.querySelectorAll('.checkbox, .right-checkbox');
    
        checkboxesInSubBox.forEach(otherCheckbox => {
            if (otherCheckbox !== checkbox) {
                otherCheckbox.checked = false;
            }
        });
    
        if (checkbox.classList.contains('right-checkbox')) {
            const correspondingCheckbox = subBox.querySelector('.checkbox');
            correspondingCheckbox.checked = true;
        }

        if (checkbox.classList.contains('dofe-checkbox')) {
            handleDofeCheckboxChange(checkbox);
        }

        applySelection();
    }

    var modal = document.getElementById('presidentAwardModal');
    var bookIcon = document.getElementById('presidentAwardIcon');
    var closeButton = document.querySelector('.modal .close');

    bookIcon.onclick = function() {
        modal.style.display = "block";
    }

    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    };


    document.getElementById('scrollTopBtn').addEventListener('click', function () {
        scrollToTop();
    });
        
    function scrollToTop() {
        const scrollOptions = {
            top: 0,
            behavior: 'smooth'
        };

        window.scrollTo(scrollOptions);
    }

    document.querySelectorAll('.editable').forEach(div => {
        div.addEventListener('blur', function() {
            this.innerText = this.innerText.toUpperCase();
        });
    });

    const suggestionsMap = {
        "1": ["1st KUALA LUMPUR COMPANY", "1st JOHOR BAHRU COMPANY", "1st MELAKA COMPANY", "1st SEREMBAN COMPANY", "1st PENANG COMPANY", "1st BINTULU COMPANY", "1st KUCHING COMPANY","1st PENGKALAN KEMPAS COMPANY", "1st MUAR COMPANY", "1st SIMPANG RENGAM COMPANY", "1st TRIANG COMPANY","1st IPOH COMPANY", "1st SANDAKAN COMPANY", "1st PENAMPANG COMPANY", "1st SARIKEI COMPANY", "1st PITAS COMPANY", "1st TAWAU COMPANY", "1st MIRI COMPANY", "1st BINTANGOR COMPANY"],
        "2": ["2nd KUALA LUMPUR COMPANY", "2nd SIBU COMPANY", "2nd MELAKA COMPANY", "2nd MANJUNG COMPANY", "2nd SEREMBAN COMPANY", "2nd KLUANG COMPANY", "2nd PENANG COMPANY", "2nd SANDAKAN COMPANY", "2nd BINTULU COMPANY", "2nd PITAS COMPANY", "2nd TAWAU COMPANY", "2nd K. KINABALU COMPANY"],
        "3": ["3rd KUALA LUMPUR COMPANY", "3rd MELAKA COMPANY", "3rd MANJUNG COMPANY", "3rd K. KINABALU COMPANY", "3rd BINTANGOR COMPANY", "3rd KUCHING COMPANY", "3rd SARIKEI COMPANY", "3rd SIBU COMPANY", "3rd TAWAU COMPANY", "3rd PITAS COMPANY", "3rd BUTTERWORTH COMPANY"],
        "4": ["4th KUALA LUMPUR COMPANY", "4th JOHOR BAHRU COMPANY", "4th MELAKA COMPANY", "4th KAMPAR COMPANY", "4th KUCHING COMPANY", "4th PETALING JAYA COMPANY", "4th BINTULU COMPANY", "4th K. KINABALU COMPANY", "4th SUNGAI PETANI COMPANY", "4th MIRI COMPANY", "4th JOHOR BAHRU COMPANY"],
        "5": ["5th KUALA LUMPUR COMPANY", "5th JOHOR BAHRU COMPANY", "5th PETALING JAYA COMPANY", "5th SANDAKAN COMPANY", "5th MIRI COMPANY", "5th KAJANG COMPANY", "5th JOHOR BAHRU COMPANY"],
        "6": ["6th KUALA LUMPUR COMPANY", "6th KUCHING COMPANY", "6th MIRI COMPANY", "6th KAJANG COMPANY", "6th Ipoh COMPANY"],
        "7": ["7th KUALA LUMPUR COMPANY", "7th KUCHING COMPANY", "7th MIRI COMPANY", "7th PETALING JAYA COMPANY", "7th Ipoh COMPANY", "7th SIBU COMPANY"],
        "8": ["8th KUALA LUMPUR COMPANY", "8th KUCHING COMPANY", "8th PETALING JAYA COMPANY", "8th Ipoh COMPANY", "8th PENANG COMPANY", "8th SIBU COMPANY"],
        "9": ["9th KUALA LUMPUR COMPANY", "9th PETALING JAYA COMPANY", "9th SIBU COMPANY", "9th KUCHING COMPANY"],
        "10": ["10th KUALA LUMPUR COMPANY", "10th SIBU COMPANY", "10th KUCHING COMPANY"],
        "11": ["11th KUALA LUMPUR COMPANY", "11th SIBU COMPANY", "11th K. KINABALU COMPANY"],
        "12": ["12th KUALA LUMPUR COMPANY", "12th SIBU COMPANY", "12th PENANG COMPANY", "12th K. KINABALU COMPANY"],
        "13": ["13th KUALA LUMPUR COMPANY", "13th K. KINABALU COMPANY", "13th KUCHING COMPANY"],
        "14": ["14th KUALA LUMPUR COMPANY", "14th SIBU COMPANY", "14th PENANG COMPANY", "14th KUCHING COMPANY"],
        "15": ["15th KUALA LUMPUR COMPANY", "15th SIBU COMPANY", "15th KUCHING COMPANY"],
        "16": ["16th KUALA LUMPUR COMPANY", "16th PENANG COMPANY", "16th KUCHING COMPANY"],
        "17": ["17th KUALA LUMPUR COMPANY", "17th KUCHING COMPANY"],
        "18": ["18th KUALA LUMPUR COMPANY", "18th PENANG COMPANY", "18th KUCHING COMPANY"],
        "19": ["19th KUALA LUMPUR COMPANY", "19th SIBU COMPANY", "19th K. KINABALU COMPANY"],
        "20": ["20th KUALA LUMPUR COMPANY", "20th SIBU COMPANY", "20th PENANG COMPANY"],
        "21": ["21st PENANG COMPANY"],
        "28": ["28th KUALA LUMPUR COMPANY"],
        "1s": ["1st KUALA LUMPUR COMPANY", "1st SIBU COMPANY"],
        "1st": ["1st KUALA LUMPUR COMPANY", "1st SIBU COMPANY"],
        "2nd": ["2nd KUALA LUMPUR COMPANY", "2nd SIBU COMPANY"],
        "3rd": ["3rd KUALA LUMPUR COMPANY"],
        "4th": ["4th KUALA LUMPUR COMPANY"],
        "5th": ["5th KUALA LUMPUR COMPANY"],
        "6th": ["6th KUALA LUMPUR COMPANY"],
        "7th": ["7th KUALA LUMPUR COMPANY"],
        "8th": ["8th KUALA LUMPUR COMPANY"],
        "9th": ["9th KUALA LUMPUR COMPANY"],
        "10th": ["10th KUALA LUMPUR COMPANY"],
        "11th": ["11th KUALA LUMPUR COMPANY"],
        "12th": ["12th KUALA LUMPUR COMPANY"],
        "13th": ["13th KUALA LUMPUR COMPANY"],
        "14th": ["14th KUALA LUMPUR COMPANY"],
        "15th": ["15th KUALA LUMPUR COMPANY"],
        "16th": ["16th KUALA LUMPUR COMPANY"],
        "17th": ["17th KUALA LUMPUR COMPANY"],
        "18th": ["18th KUALA LUMPUR COMPANY"],
        "19th": ["19th KUALA LUMPUR COMPANY"],
        "20th": ["20th KUALA LUMPUR COMPANY"],
        "28th": ["28th KUALA LUMPUR COMPANY"],
        "MELAKA": ["1st MELAKA COMPANY", "2nd MELAKA COMPANY", "3rd MELAKA COMPANY", "4th MELAKA COMPANY"],
        "MUAR": ["1st MUAR COMPANY"],
        "JOHOR": ["1st JOHOR BAHRU COMPANY", "4th JOHOR BAHRU COMPANY", "5th JOHOR BAHRU COMPANY"],
        "SEREMBAN": ["1st SEREMBAN COMPANY", "2nd SEREMBAN COMPANY"],
        "PENANG": ["1st PENANG COMPANY", "2nd PENANG COMPANY", "8th PENANG COMPANY", "12th PENANG COMPANY", "14th PENANG COMPANY", "16th PENANG COMPANY", "18th PENANG COMPANY", "19th PENANG COMPANY", "21st PENANG COMPANY"],
        "KUCHING": ["1st KUCHING COMPANY", "2nd KUCHING COMPANY", "3rd KUCHING COMPANY", "4th KUCHING COMPANY", "6th KUCHING COMPANY", "7th KUCHING COMPANY", "8th KUCHING COMPANY", "9th KUCHING COMPANY", "10th KUCHING COMPANY", "11th KUCHING COMPANY", "12th KUCHING COMPANY", "13th KUCHING COMPANY", "14th KUCHING COMPANY", "15th KUCHING COMPANY", "16th KUCHING COMPANY", "17th KUCHING COMPANY"],
        "BINTULU": ["1st BINTULU COMPANY", "2nd BINTULU COMPANY", "4th BINTULU COMPANY"],
        "K. KINABALU": ["2nd K. KINABALU COMPANY", "3rd K. KINABALU COMPANY", "4th K. KINABALU COMPANY", "11th K. KINABALU COMPANY", "12th K. KINABALU COMPANY", "13th K. KINABALU COMPANY", "19th K. KINABALU COMPANY"],
        "SANDAKAN": ["1st SANDAKAN COMPANY", "2nd SANDAKAN COMPANY", "5th SANDAKAN COMPANY"],
        "TAWAU": ["1st TAWAU COMPANY", "2nd TAWAU COMPANY", "3rd TAWAU COMPANY"],
        "PITAS": ["1st PITAS COMPANY", "2nd PITAS COMPANY", "3rd PITAS COMPANY"],
        "SARIKEI": ["1st SARIKEI COMPANY", "3rd SARIKEI COMPANY"],
        "MIRI": ["1st MIRI COMPANY", "2nd MIRI COMPANY", "3rd MIRI COMPANY", "4th MIRI COMPANY", "5th MIRI COMPANY", "6th MIRI COMPANY", "7th MIRI COMPANY"],
        "PETALING JAYA": ["1st PETALING JAYA COMPANY", "4th PETALING JAYA COMPANY", "5th PETALING JAYA COMPANY", "7th PETALING JAYA COMPANY", "8th PETALING JAYA COMPANY", "9th PETALING JAYA COMPANY"],
        "PENAMPANG": ["1st PENAMPANG COMPANY"],
        "PENANG": ["1st PENANG COMPANY", "2nd PENANG COMPANY", "8th PENANG COMPANY", "12th PENANG COMPANY", "14th PENANG COMPANY", "16th PENANG COMPANY", "18th PENANG COMPANY", "19th PENANG COMPANY", "21st PENANG COMPANY"],
        "PENGKALAN KEMPAS": ["1st PENGKALAN KEMPAS COMPANY"],
        "PITAS": ["1st PITAS COMPANY", "2nd PITAS COMPANY", "3rd PITAS COMPANY"],
        "PUCHONG": ["1st PUCHONG COMPANY", "2nd PUCHONG COMPANY"],
        "PUTRAJAYA": ["1st PUTRAJAYA COMPANY"] 
    };

    const companyInput = document.getElementById('nametag-company');
    const suggestionsList = document.getElementById('suggestionsList');

    function showSuggestions() {
        const input = companyInput.innerText.toLowerCase(); 
        suggestionsList.innerHTML = ''; 

        if (input) {
            const filteredSuggestions = Object.keys(suggestionsMap)
                .filter(shortcut => shortcut.toLowerCase().startsWith(input))
                .flatMap(shortcut => suggestionsMap[shortcut]);

            if (filteredSuggestions.length > 0) {
                const suggestionElements = filteredSuggestions.map(fullTerm => {
                    const div = document.createElement('div');
                    div.textContent = fullTerm;
                    div.classList.add('autocomplete-suggestion');
                    div.addEventListener('click', () => {
                        companyInput.innerText = fullTerm;
                        suggestionsList.style.display = 'none'; 
                    });
                    return div;
                });

                suggestionsList.append(...suggestionElements);
                suggestionsList.style.display = 'block';
            } else {
                suggestionsList.style.display = 'none';
            }
        } else {
            suggestionsList.style.display = 'none';
        }
    }

    companyInput.addEventListener('input', showSuggestions);
    companyInput.addEventListener('keyup', showSuggestions); 

    document.addEventListener('click', (event) => {
        if (!event.target.closest('#nametag-company') && !event.target.closest('#suggestionsList')) {
            suggestionsList.style.display = 'none';
        }
    });

document.getElementById('screenshotBtn').addEventListener('click', async function() {
    const name = document.getElementById('nametag-name').innerText.toUpperCase();
    const company = document.getElementById('nametag-company').innerText.toUpperCase();

    document.getElementById('nametag-name').innerText = name || 'NAME';
    document.getElementById('nametag-company').innerText = company || 'COMPANY';

    const toggleSidebar = document.getElementById('toggleSidebar');
    const originalDisplay = toggleSidebar ? toggleSidebar.style.display : null;
    if (toggleSidebar) toggleSidebar.style.display = 'none';

    try {
        const canvas = await html2canvas(document.getElementById('screenshot-container'), {
            scrollY: -window.scrollY,
            scale: window.devicePixelRatio,
            useCORS: true
        });

        if ('showSaveFilePicker' in window) {
            canvas.toBlob(async function(blob) {
                try {
                    const handle = await window.showSaveFilePicker({
                        suggestedName: 'screenshot.png',
                        types: [{
                            description: 'PNG Image',
                            accept: { 'image/png': ['.png'] },
                        }],
                    });

                    const writable = await handle.createWritable();
                    await writable.write(blob);
                    await writable.close();

                    console.log('Screenshot saved successfully.');
                } catch (err) {
                    console.error('Error saving file:', err);
                } finally {
                    if (toggleSidebar) toggleSidebar.style.display = originalDisplay;
                }
            }, 'image/png');
        } else {
            const img = document.createElement('img');
            img.src = canvas.toDataURL('image/png');

            const link = document.createElement('a');
            link.href = img.src;
            link.download = 'screenshot.png';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (toggleSidebar) toggleSidebar.style.display = originalDisplay;
        }
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        if (toggleSidebar) toggleSidebar.style.display = originalDisplay;
    }
});


    const nameField = document.getElementById('nametag-name');
    nameField.addEventListener('input', function () {
        const maxLength = 15;
        if (this.innerText.length > maxLength) { 
            this.innerText = this.innerText.slice(0, maxLength);
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(this.childNodes[0], maxLength);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            showCustomAlert("Cannot add any more characters.");
        }
    });

    const nametag = document.getElementById('nametag');
    nametag.addEventListener('click', function () {
        const currentColor = window.getComputedStyle(this).backgroundColor;
        if (currentColor === 'rgb(255, 255, 255)' || currentColor === 'white') {
            this.style.backgroundColor = '#3498db';
            this.style.color = '#ffffff';
        } else { 
            this.style.backgroundColor = '#ffffff';
            this.style.color = '#000000';
        }
    });

});

function enforcePrerequisites() {
    document.addEventListener('change', function (event) {
        const checkbox = event.target;
        
        const firstAidCheckbox = document.querySelector('[data-url="image/Right/First Aid.png"] .checkbox');
        const swimmingCheckbox = document.querySelector('[data-url="image/Right/Swimming.png"] .checkbox');
        const presidentCheckbox = document.querySelector('[data-url="image/Left/Presidents.png"] .checkbox-right');
        const founderCheckbox = document.querySelector('[data-url="image/Left/Founder.png"] .checkbox-right');

        if (checkbox.closest('[data-url="image/Right/Expedition.png"]') && checkbox.checked) {
            if (firstAidCheckbox && !firstAidCheckbox.checked) {
                showCustomAlert("We recommend earning the First Aid badge before selecting Expedition for a safer and better experience.");
            }
        }

        if (checkbox.closest('[data-url="image/Right/Water Adventure.png"]') && checkbox.checked) {
            if (swimmingCheckbox && !swimmingCheckbox.checked) {
                showCustomAlert("We recommend earning the Swimming badge before selecting Water Adventure for a safer and better experience.");
            }
        }

        if (checkbox === founderCheckbox && checkbox.checked) {
            if (presidentCheckbox && !presidentCheckbox.checked) {
                showCustomAlert("You must check the President's Award before selecting the Founder's Award.");
                checkbox.checked = false;
            }
        }

        if (checkbox === presidentCheckbox && !checkbox.checked) {
            if (founderCheckbox) {
                founderCheckbox.checked = false;
            }
        }
    });
}

enforcePrerequisites();

function showCustomAlert(message) {
    document.getElementById("alertMessage").innerText = message;
    document.getElementById("customAlert").style.display = "block";
    document.getElementById("customAlertOverlay").style.display = "block";
}

function closeCustomAlert() {
    document.getElementById("customAlert").style.display = "none";
    document.getElementById("customAlertOverlay").style.display = "none";
}




function toggleSidebar() {
    var sidebar = document.getElementById("side-bar");
    var isOpen = sidebar.style.left === "0px" || sidebar.style.left === "";

    if (isOpen) {
        side_barclose();
        document.body.classList.remove('sidebar-open');
    } else {
        side_baropen();
        document.body.classList.add('sidebar-open');
    }
}

function side_baropen() {
    document.getElementById("side-bar").style.left = "0";
    document.body.classList.add('sidebar-open'); 
}

function side_barclose() {
    document.getElementById("side-bar").style.left = "-9999px";
    document.body.classList.add('sidebar-open'); 
}

function collapseAllSubmenus() {
    const submenuButtons = document.querySelectorAll('.sub-btn');
    submenuButtons.forEach(btn => {
        const subMenu = btn.nextElementSibling;
        const icon = btn.querySelector('i');
        subMenu.style.display = 'none';
        icon.classList.remove('fa-caret-down');
        icon.classList.add('fa-caret-right');
    });
}

function toggleSubMenu(btn) {
    const subMenu = btn.nextElementSibling;
    const icon = btn.querySelector('i');

    if (subMenu.style.display === 'block' || subMenu.style.display === '') {
        subMenu.style.display = 'none';
        icon.classList.remove('fa-caret-down');
        icon.classList.add('fa-caret-right');
    } else {
        subMenu.style.display = 'block';
        icon.classList.remove('fa-caret-right');
        icon.classList.add('fa-caret-down');
    }
}

function handleSelectChange(select) {
    const value = parseInt(select.value);
    const threeYearBadge = document.getElementById('three-year-badge');
    const longYearBadge = document.getElementById('long-year-badge');

    if (value >= 3 && value <= 4) {
        threeYearBadge.checked = true;
        longYearBadge.checked = false;
        
        const progressBar = document.querySelector('.president-container-box[title="THREE YEAR SERVICE BADGE"] .progress-bar');
        const progressNumber = document.querySelector('.president-container-box[title="THREE YEAR SERVICE BADGE"] .progress-number');
    
        progressBar.style.width = '100%';
        progressNumber.textContent = '1/1 (100%)';
    } else if (value >= 5) {
        longYearBadge.checked = true;
        threeYearBadge.checked = true;
        
        const progressBar = document.querySelector('.president-container-box[title="THREE YEAR SERVICE BADGE"] .progress-bar');
        const progressNumber = document.querySelector('.president-container-box[title="THREE YEAR SERVICE BADGE"] .progress-number');
    
        progressBar.style.width = '100%';
        progressNumber.textContent = '1/1 (100%)';
    } else {
        threeYearBadge.checked = false;
        longYearBadge.checked = false;
    
        const progressBar = document.querySelector('.president-container-box[title="THREE YEAR SERVICE BADGE"] .progress-bar');
        const progressNumber = document.querySelector('.president-container-box[title="THREE YEAR SERVICE BADGE"] .progress-number');
    
        progressBar.style.width = '0%';
        progressNumber.textContent = '0/1 (0%)';
    }
}

function handleThreeYearBadge(checkbox) {
    const oneYearService = document.getElementById('one-year-service');
    const longYearBadge = document.getElementById('long-year-badge');

    if (checkbox.checked) {
        if (longYearBadge.checked) {
            oneYearService.value = '5';
        } else {
            oneYearService.value = '3';
        }
    } else {
        oneYearService.value = '0';
        longYearBadge.checked = false; 
    }
}

function handleLongYearBadge(checkbox) {
    const oneYearService = document.getElementById('one-year-service');
    const threeYearBadge = document.getElementById('three-year-badge');
    const progressBar = document.querySelector('.president-container-box[title="THREE YEAR SERVICE BADGE"] .progress-bar');
    const progressNumber = document.querySelector('.president-container-box[title="THREE YEAR SERVICE BADGE"] .progress-number');

    if (checkbox.checked) {
        oneYearService.value = '5';
        threeYearBadge.checked = true;
        progressBar.style.width = '100%';
        progressNumber.textContent = '1/1 (100%)';
    } else {
        oneYearService.value = '0';
        threeYearBadge.checked = false;
        progressBar.style.width = '0%';
        progressNumber.textContent = '0/1 (0%)';
    }
}

function clearAll() {
    const checkboxes = document.querySelectorAll('.sub-item input, .checkbox, .right-checkbox, .right-checkbox-none');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        bar.style.width = '0%';
    });

    const presidentBoxes = document.querySelectorAll('.president-container-box');
    presidentBoxes.forEach(box => {
        const progressNumber = box.querySelector('.progress-number');
        if (progressNumber) {
            const totalCount = progressNumber.textContent.split('/')[1].split(' ')[0]; 
            progressNumber.textContent = `0/${totalCount} (0%)`;
        }
    });

    const overallProgressBar = document.querySelector('.president-container-overall .progress-bar');
    const overallProgressNumber = document.querySelector('.president-container-overall .progress-number-overall');
    overallProgressBar.style.width = '0%';
    overallProgressNumber.textContent = '0%';

    const oneYearServiceSelect = document.getElementById('one-year-service');
    if (oneYearServiceSelect) {
        oneYearServiceSelect.value = '0';
    }

    const progressNumbersMap = {
        'Compulsory': '0 / 4&nbsp;&nbsp;',
        'Interest (Group A)': '0 / 12',
        'Adventure (Group B)': '0 / 3&nbsp;&nbsp;',
        'Community (Group C)': '0 / 9&nbsp;&nbsp;',
        'Physical (Group D)': '0 / 6&nbsp;&nbsp;',
        'Service Awards': '0 / 5&nbsp;&nbsp;',
        'Special Awards': '0 / 8&nbsp;&nbsp;',
        'Total Basic Proficiency Award': '0 / 34',
        'Total Advanced Proficiency Award': '0 / 33'
    };

    const progressRows = document.querySelectorAll('.progress-row');
    progressRows.forEach(row => {
        const progressCell = row.querySelector('.progress-cell');
        const progressNumber = row.querySelector('.progress-number');
        const key = progressCell.textContent.trim();
        if (progressNumbersMap[key]) {
            progressNumber.innerHTML = `: ${progressNumbersMap[key]}`;
        }
    });

    const selectedBadgesContainer = document.getElementById('selectedBadgesContainer');
    selectedBadgesContainer.innerHTML = '';

    const rightBox = document.getElementById('rightBox');
    rightBox.innerHTML = '';

    const rankDisplay = document.querySelector('.progress-rank');
    rankDisplay.textContent = 'Private';

    window.addEventListener('click', function (event) {
    const presidentModal = document.getElementById('presidentAwardModal');
    if (event.target === presidentModal) {
        presidentModal.style.display = 'none';
    }
    });


    const leftBox = document.querySelector('.left-box');
    const square = document.querySelector('.square');
    const triangle = document.querySelector('.triangle');
    const rightChevrons = document.querySelectorAll('.right-chevron');
    leftBox.style.cssText = `
        width: 550px; 
        height: 760px;
        border-radius: 10px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap; 
        justify-content: center; 
        align-items: flex-start; 
        text-align: center;
        background: #2B2A2F;
        position: relative;
        font-weight: 900;
        margin: 5px 20px 20px 20px;
    `;
    square.style.display = 'none';
    triangle.style.display = 'none';
    rightChevrons.forEach(chevron => {
        chevron.style.display = 'none';
    });

    const progressbox = document.getElementById('selectedCount');
    progressbox.style.marginTop = '0';

    const badgeContainer = document.getElementById('link-badge');
    badgeContainer.textContent = '';

    updateAllProgress();
    updateOverallProgress();
    updateRankDisplay();
    updateSpecialProgress();
    updateNCOProgress();
}

$(document).ready(function () {
    function applySelection() {
        const selectedBadges = document.querySelectorAll('.sub-item input:checked');
        const selectedBadgesContainer = document.getElementById('selectedBadgesContainer');
        const rightBox = document.getElementById('rightBox');
        const leftBox = document.getElementById('leftBox');
        const linkBadgeContainer = document.getElementById('link-badge');
        const progressbox = document.getElementById('selectedCount');
        const badgesData = [];
        let targetBadgeData = null;
        let dofeBadgeData = null;
    
        let isLinkBadgeSelected = false;
        let rankSelected = false;
        let badgeCount = 0;
    
        const uniqueBadges = new Set();
    
        selectedBadges.forEach(badge => {
            const badgeItem = badge.closest('.sub-item');
            const badgeId = badgeItem.getAttribute('data-url'); 
    
            if (!uniqueBadges.has(badgeId)) {
                uniqueBadges.add(badgeId);
                badgeCount++;
            }
    
            const imageUrl = badgeItem.getAttribute('data-url');
            const badgeText = badgeItem.querySelector('.sub-box-text').innerText;
            const isRightSubMenu = badgeItem.closest('.sub-menu-right1, .sub-menu-right2, .sub-menu-right3') !== null;
            const checkboxType = badge.classList.contains('right-checkbox') ? 'right-checkbox' : 'checkbox';
    
            if (badgeText === 'LINK BADGE') {
                isLinkBadgeSelected = true;
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = 'LINK BADGE';
                linkBadgeContainer.innerHTML = '';
                linkBadgeContainer.appendChild(img);
            }
    
            if (badgeText === 'TARGET') {
                targetBadgeData = {
                    imageUrl: imageUrl,
                    badgeText: badgeText,
                    checkboxType: checkboxType
                };
            } else if (badge.classList.contains('dofe-checkbox')) {
                dofeBadgeData = {
                    imageUrl: imageUrl,
                    badgeText: badgeText,
                    isRightSubMenu: isRightSubMenu,
                    checkboxType: checkboxType
                };
            } else {
                badgesData.push({
                    imageUrl: imageUrl,
                    badgeText: badgeText,
                    isRightSubMenu: isRightSubMenu,
                    checkboxType: checkboxType
                });
            }
    
            if (badge.classList.contains('rank-checkbox')) {
                rankSelected = true;
            }
        });
    
        if (!isLinkBadgeSelected) {
            linkBadgeContainer.innerHTML = '';
        }
    
        badgesData.sort((a, b) => a.badgeText.localeCompare(b.badgeText));
    
        if (targetBadgeData) {
            badgesData.unshift(targetBadgeData);
        }
    
        selectedBadgesContainer.innerHTML = '';
        rightBox.innerHTML = '';
    
        badgesData.forEach((badgeData, index) => {
            const img = document.createElement('img');
            img.src = badgeData.imageUrl;
    
            if (!badgeData.isRightSubMenu) {
                if (badgeData.checkboxType === 'right-checkbox') {
                    const existingImage = selectedBadgesContainer.querySelector(`img[src="${badgeData.imageUrl}"]`);
    
                    if (existingImage) {
                        const existingWrapper = existingImage.parentElement;
                        if (!existingWrapper.classList.contains('red-cloths')) {
                            const redClothDiv = document.createElement('div');
                            existingImage.classList.add('leftmost-badge');
                            redClothDiv.classList.add('red-cloths');
                            existingImage.parentNode.replaceChild(redClothDiv, existingImage);
                            redClothDiv.appendChild(existingImage);
                        }
                    } else {
                        const redClothDiv = document.createElement('div');
                        redClothDiv.classList.add('red-cloths');
                        redClothDiv.appendChild(img);
                        selectedBadgesContainer.appendChild(redClothDiv);
                    }
                } else {
                    selectedBadgesContainer.appendChild(img);
    
                    if (index < 5) {
                        img.classList.add('leftmost-badge');
                    } else {
                        img.classList.add('centered-badge');
                    }
                }
            }
        });
    
        if (rankSelected) {
            const isMobile = window.innerWidth <= 768;
            
            if (badgeCount <= 10) {
                leftBox.style.height = '350px';
            } else if (badgeCount >= 11 && badgeCount <= 15) {
                leftBox.style.height = '400px';
            } else if (badgeCount >= 16 && badgeCount <= 20) {
                leftBox.style.height = '500px';
            } else if (badgeCount >= 21 && badgeCount <= 25) {
                leftBox.style.height = '600px';
            } else if (badgeCount >= 26 && badgeCount <= 30) {
                leftBox.style.height = '700px';
            } else {
                leftBox.style.height = '760px';
            }

            if (!isMobile) {
                if (badgeCount >= 11 && badgeCount <= 15) {
                    progressbox.style.marginTop = '50px';
                } else if (badgeCount >= 16 && badgeCount <= 20) {
                    progressbox.style.marginTop = '130px';
                } else if (badgeCount >= 21 && badgeCount <= 25) {
                    progressbox.style.marginTop = '210px';
                } else if (badgeCount >= 26) {
                    progressbox.style.marginTop = '290px';
                }
            } else {
                progressbox.style.marginTop = '0px';
            }
        } else {
            leftBox.style.height = '760px';
            progressbox.style.marginTop = '0px';
        }

        applyRankCSS();
        renderRightBox(badgesData, dofeBadgeData);
        updateAllProgress();
    }
    
    function handleCheckboxChange(checkbox) {
        const subBox = checkbox.closest('.sub-item');
        const checkboxesInSubBox = subBox.querySelectorAll('.checkbox, .right-checkbox');
    
        checkboxesInSubBox.forEach(otherCheckbox => {
            if (otherCheckbox !== checkbox) {
                otherCheckbox.checked = false;
            }
        });
    
        if (checkbox.classList.contains('right-checkbox')) {
            const correspondingCheckbox = subBox.querySelector('.checkbox');
            correspondingCheckbox.checked = true;
        }

        if (checkbox.classList.contains('dofe-checkbox')) {
            handleDofeCheckboxChange(checkbox);
        }
        
        applySelection(); 
    }

    function handleDofeCheckboxChange(checkbox) {
        const dofeCheckboxes = document.querySelectorAll('.dofe-checkbox');
        dofeCheckboxes.forEach(otherCheckbox => {
            if (otherCheckbox !== checkbox) {
                otherCheckbox.checked = false;
            }
        });
    }

    document.addEventListener('change', function (event) {
        const targetCheckbox = event.target.closest('.checkbox, .right-checkbox, .checkbox-right');
        if (targetCheckbox) {
            handleCheckboxChange(targetCheckbox);
            updateOverallProgress();
        }
    });

    function renderRightBox(badgesData, dofeBadgeData) {
        const rightBox = document.getElementById('rightBox');
        const oneYearServiceCount = parseInt(document.getElementById('one-year-service').value) || 0;
        const layoutStructure = [
            [null, null, null, "FOUNDER’S AWARD", null, null, null],
            [null, "PRESIDENT’S AWARD", "GOLD AWARD", null],
            [null, null, "GOLD SCHOLASTIC AWARDS", "SILVER SCHOLASTIC AWARDS", "BRONZE SCHOLASTIC AWARDS", null, null],
            [null, null, "LONG YEAR SERVICE BADGE", "NCO PROFICIENCY", "THREE YEAR SERVICE BADGE", null, null],
        ];
    
        const oneYearServiceRow = Array(10).fill(null);
        const juniorServiceChecked = badgesData.some(badge => badge.badgeText === "JUNIOR SECTION SERVICE BADGE");
        const juniorServiceIndex = Math.max(0, 4 - Math.floor(oneYearServiceCount / 2));
    
        if (juniorServiceChecked) {
            oneYearServiceRow[juniorServiceIndex] = "JUNIOR SECTION SERVICE BADGE";
            for (let i = 0; i < oneYearServiceCount; i++) {
                oneYearServiceRow[juniorServiceIndex + 1 + i] = "ONE YEAR SERVICE BADGE";
            }
        } else {
            for (let i = 0; i < oneYearServiceCount; i++) {
                oneYearServiceRow[juniorServiceIndex + i] = "ONE YEAR SERVICE BADGE";
            }
        }
    
        if (oneYearServiceCount === 1 && !juniorServiceChecked) {
            oneYearServiceRow[juniorServiceIndex] = "ONE YEAR SERVICE BADGE";
        }
    
        layoutStructure.push(oneYearServiceRow);
    
        const newContent = document.createElement('div');
    
        layoutStructure.forEach(rowData => {
            const rowContainer = document.createElement('div');
            rowContainer.classList.add('right-box-row');
            rowContainer.style.display = 'flex';
            rowContainer.style.justifyContent = 'center';
            const badgeItems = rowData.filter(badgeText => badgeText !== null);
    
            if (badgeItems.length === 1) {
                const singleBadgeText = badgeItems[0];
                let badgeData = badgesData.find(b => b.badgeText === singleBadgeText);
    
                if (singleBadgeText === "JUNIOR SECTION SERVICE BADGE") {
                    if (oneYearServiceCount === 0) {
                        badgeData = { imageUrl: "image/Left/Junior One-Year.png", badgeText: "JUNIOR SECTION SERVICE BADGE" };
                    } else {
                        badgeData = { imageUrl: "image/Left/Junior One-Year1.png", badgeText: "JUNIOR SECTION SERVICE BADGE" };
                    }
                }
    
                if (singleBadgeText === "ONE YEAR SERVICE BADGE" && !juniorServiceChecked) {
                    badgeData = { imageUrl: "image/Left/One-Year.png", badgeText: "ONE YEAR SERVICE BADGE" };
                }
    
                if (badgeData) {
                    const img = document.createElement('img');
                    img.src = badgeData.imageUrl;
                    img.alt = singleBadgeText;
                    rowContainer.style.justifyContent = 'center'; 
                    rowContainer.appendChild(img);
                }
            } else {
                rowData.forEach(badgeText => {
                    let badgeData = badgesData.find(b => b.badgeText === badgeText);
    
                    if (badgeText === "JUNIOR SECTION SERVICE BADGE") {
                        if (oneYearServiceCount === 0) {
                            badgeData = { imageUrl: "image/Left/Junior One-Year.png", badgeText: "JUNIOR SECTION SERVICE BADGE" };
                        } else {
                            badgeData = { imageUrl: "image/Left/Junior One-Year1.png", badgeText: "JUNIOR SECTION SERVICE BADGE" };
                        }
                    }
    
                    if (badgeData) {
                        const img = document.createElement('img');
                        img.src = badgeData.imageUrl;
                        img.alt = badgeText;
                        rowContainer.appendChild(img);
                    } else if (badgeText === "ONE YEAR SERVICE BADGE") {
                        const img = document.createElement('img');
                        img.src = "image/Left/One-Year1.png"; 
                        img.alt = "ONE YEAR SERVICE BADGE";
                        rowContainer.appendChild(img);
                    } else if (badgeText !== null) {
                        const placeholder = document.createElement('div');
                        placeholder.classList.add('badge-placeholder');
                        placeholder.style.visibility = 'hidden'; 
                        rowContainer.appendChild(placeholder);
                    } else {
                        const emptySpace = document.createElement('div');
                        emptySpace.classList.add('empty-space');
                        rowContainer.appendChild(emptySpace);
                    }
                });
            }
            newContent.appendChild(rowContainer); 
        });
    
        rightBox.innerHTML = ''; 
        rightBox.appendChild(newContent); 
    
        if (dofeBadgeData) {
            const presidentAwardRow = newContent.children[1]; 

            const existingDofeBadges = presidentAwardRow.querySelectorAll('img[alt^="DOFE"]');
            existingDofeBadges.forEach(badge => badge.remove());
    
            const dofeImg = document.createElement('img');
            dofeImg.src = dofeBadgeData.imageUrl;
            dofeImg.alt = dofeBadgeData.badgeText; 
            presidentAwardRow.insertBefore(dofeImg, presidentAwardRow.children[2]); 
        }
    }

    function updateProgress(section, subMenuClass, totalItems, addSpace = true) {
        let selectedItems = 0;

        if (subMenuClass === 'sub-menu-right1') {
            const oneYearServiceValue = parseInt($('.one-year-service').val());
            selectedItems += oneYearServiceValue > 0 ? 1 : 0;
            selectedItems += $(`.${subMenuClass} .checkbox-right:checked`).length;

            $('.one-year-service').off('change').on('change', function () {
                const selectedValue = parseInt($(this).val());
                const selectedItemsWithOneYearService = selectedValue > 0 ? 1 : 0;
                selectedItems = selectedItemsWithOneYearService + $(`.${subMenuClass} .checkbox-right:checked`).length;
                updateProgress(section, subMenuClass, totalItems, addSpace);
                applySelection();
            });

        } else {
            const subMenu = $(`.${subMenuClass}`);
            const uniqueItems = new Set();

            subMenu.each(function () {
                const checkboxes = $(this).find('.checkbox:checked');
                const rightCheckboxes = $(this).find('.right-checkbox:checked');

                checkboxes.each(function () {
                    const parentItem = $(this).closest('.sub-item').attr('data-url');
                    uniqueItems.add(parentItem);
                });

                rightCheckboxes.each(function () {
                    const parentItem = $(this).closest('.sub-item').attr('data-url');
                    uniqueItems.add(parentItem);
                });
            });

            selectedItems = uniqueItems.size;
        }

        let progressNumber = `: ${selectedItems} / ${totalItems}`;
        if (addSpace) {
            progressNumber += '&nbsp;&nbsp;';
        }
        $(`.progress-row:contains(${section}) .progress-number`).html(progressNumber);
    }

    function updateSpecialAwardsProgress() {
        const selectedItems = $('.sub-menu-right2 .checkbox-right:checked').length;
        let progressNumber = `: ${selectedItems} / 8`;
        progressNumber += '&nbsp;&nbsp;';
        $(`.progress-row:contains(Special Awards) .progress-number`).html(progressNumber);
    }
    
    function updateTotalBasicProficiencyProgress() {
        const selectedItems = new Set();

        $('.checkbox:checked, .right-checkbox:checked').each(function () {
            const parentItem = $(this).closest('.sub-item').attr('data-url');
            selectedItems.add(parentItem);
        });

        let progressNumber = `: ${selectedItems.size} / 34`;
        progressNumber;
        $(`.progress-row:contains(Total Basic Proficiency Award) .progress-number`).html(progressNumber);
    }

    function updateTotalAdvancedProficiencyProgress() {
        const selectedItems = $('.right-checkbox:checked').length;
        let progressNumber = `: ${selectedItems} / 33`;
        progressNumber;
        $(`.progress-row:contains(Total Advanced Proficiency Award) .progress-number`).html(progressNumber);
    }

    function updateAllProgress() {
        updateProgress('Compulsory', 'sub-menu', 4);
        updateProgress('Interest (Group A)', 'sub-menu1', 12, false);
        updateProgress('Adventure (Group B)', 'sub-menu2', 3);
        updateProgress('Community (Group C)', 'sub-menu3', 9);
        updateProgress('Physical (Group D)', 'sub-menu4', 6);
        updateProgress('Service Awards', 'sub-menu-right1', 5);
        updateSpecialAwardsProgress();
        updateTotalBasicProficiencyProgress();
        updateTotalAdvancedProficiencyProgress();
    }

    function handleCheckboxChange() {
        applySelection(); 
        updateAllProgress();
        updateSpecialAwardsProgress(); 
    }

    $('.sub-item input.checkbox, .sub-item input.right-checkbox, .sub-item input.checkbox-right').on('change', function () {
        handleCheckboxChange();
    });

    updateAllProgress(); 
    applySelection();
    
    function handleCheckboxChange(checkbox) {
        const subBox = checkbox.closest('.sub-item');
        const checkboxesInSubBox = subBox.querySelectorAll('.checkbox, .right-checkbox');
    
        checkboxesInSubBox.forEach(otherCheckbox => {
            if (otherCheckbox !== checkbox) {
                otherCheckbox.checked = false;
            }
        });
    
        if (checkbox.classList.contains('right-checkbox')) {
            const correspondingCheckbox = subBox.querySelector('.checkbox');
            correspondingCheckbox.checked = true;
        }

        if (checkbox.classList.contains('dofe-checkbox')) {
            handleDofeCheckboxChange(checkbox);
        }
        
        applySelection(); 
    }

    function handleDofeCheckboxChange(checkbox) {
        const dofeCheckboxes = document.querySelectorAll('.dofe-checkbox');
        dofeCheckboxes.forEach(otherCheckbox => {
          if (otherCheckbox !== checkbox) {
            otherCheckbox.checked = false;
          }
        });
    }

    document.addEventListener('change', function (event) {
        const targetCheckbox = event.target.closest('.dofe-checkbox');
        if (targetCheckbox) {
            handleDofeCheckboxChange(targetCheckbox);
        }
    });

    document.addEventListener('change', function (event) {
    const targetCheckbox = event.target.closest('.checkbox, .right-checkbox, .checkbox-right');
    if (targetCheckbox) {
        handleCheckboxChange(targetCheckbox);
        updateOverallProgress();
    }
    });

    function renderRightBox(badgesData, dofeBadgeData) {
        const rightBox = document.getElementById('rightBox');
        const oneYearServiceCount = parseInt(document.getElementById('one-year-service').value) || 0;
        const layoutStructure = [
            [null, null, null, "FOUNDER’S AWARD", null, null, null],
            [null, "PRESIDENT’S AWARD", "GOLD AWARD", null],
            [null, null, "GOLD SCHOLASTIC AWARDS", "SILVER SCHOLASTIC AWARDS", "BRONZE SCHOLASTIC AWARDS", null, null],
            [null, null, "LONG YEAR SERVICE BADGE", "NCO PROFICIENCY", "THREE YEAR SERVICE BADGE", null, null],
        ];
    
        const oneYearServiceRow = Array(10).fill(null);
        const juniorServiceChecked = badgesData.some(badge => badge.badgeText === "JUNIOR SECTION SERVICE BADGE");
        const juniorServiceIndex = Math.max(0, 4 - Math.floor(oneYearServiceCount / 2));
    
        if (juniorServiceChecked) {
            oneYearServiceRow[juniorServiceIndex] = "JUNIOR SECTION SERVICE BADGE";
            for (let i = 0; i < oneYearServiceCount; i++) {
                oneYearServiceRow[juniorServiceIndex + 1 + i] = "ONE YEAR SERVICE BADGE";
            }
        } else {
            for (let i = 0; i < oneYearServiceCount; i++) {
                oneYearServiceRow[juniorServiceIndex + i] = "ONE YEAR SERVICE BADGE";
            }
        }
    
        if (oneYearServiceCount === 1 && !juniorServiceChecked) {
            oneYearServiceRow[juniorServiceIndex] = "ONE YEAR SERVICE BADGE";
        }
    
        layoutStructure.push(oneYearServiceRow);
    
        const newContent = document.createElement('div');
    
        layoutStructure.forEach(rowData => {
            const rowContainer = document.createElement('div');
            rowContainer.classList.add('right-box-row');
            rowContainer.style.display = 'flex';
            rowContainer.style.justifyContent = 'center';
            const badgeItems = rowData.filter(badgeText => badgeText !== null);
    
            if (badgeItems.length === 1) {
                const singleBadgeText = badgeItems[0];
                let badgeData = badgesData.find(b => b.badgeText === singleBadgeText);
    
                if (singleBadgeText === "JUNIOR SECTION SERVICE BADGE") {
                    if (oneYearServiceCount === 0) {
                        badgeData = { imageUrl: "image/Left/Junior One-Year.png", badgeText: "JUNIOR SECTION SERVICE BADGE" };
                    } else {
                        badgeData = { imageUrl: "image/Left/Junior One-Year1.png", badgeText: "JUNIOR SECTION SERVICE BADGE" };
                    }
                }
    
                if (singleBadgeText === "ONE YEAR SERVICE BADGE" && !juniorServiceChecked) {
                    badgeData = { imageUrl: "image/Left/One-Year.png", badgeText: "ONE YEAR SERVICE BADGE" };
                }
    
                if (badgeData) {
                    const img = document.createElement('img');
                    img.src = badgeData.imageUrl;
                    img.alt = singleBadgeText;
                    rowContainer.style.justifyContent = 'center'; 
                    rowContainer.appendChild(img);
                }
            } else {
                rowData.forEach(badgeText => {
                    let badgeData = badgesData.find(b => b.badgeText === badgeText);
    
                    if (badgeText === "JUNIOR SECTION SERVICE BADGE") {
                        if (oneYearServiceCount === 0) {
                            badgeData = { imageUrl: "image/Left/Junior One-Year.png", badgeText: "JUNIOR SECTION SERVICE BADGE" };
                        } else {
                            badgeData = { imageUrl: "image/Left/Junior One-Year1.png", badgeText: "JUNIOR SECTION SERVICE BADGE" };
                        }
                    }
    
                    if (badgeData) {
                        const img = document.createElement('img');
                        img.src = badgeData.imageUrl;
                        img.alt = badgeText;
                        rowContainer.appendChild(img);
                    } else if (badgeText === "ONE YEAR SERVICE BADGE") {
                        const img = document.createElement('img');
                        img.src = "image/Left/One-Year1.png"; 
                        img.alt = "ONE YEAR SERVICE BADGE";
                        rowContainer.appendChild(img);
                    } else if (badgeText !== null) {
                        const placeholder = document.createElement('div');
                        placeholder.classList.add('badge-placeholder');
                        placeholder.style.visibility = 'hidden'; 
                        rowContainer.appendChild(placeholder);
                    } else {
                        const emptySpace = document.createElement('div');
                        emptySpace.classList.add('empty-space');
                        rowContainer.appendChild(emptySpace);
                    }
                });
            }
            newContent.appendChild(rowContainer); 
        });
    
        rightBox.innerHTML = ''; 
        rightBox.appendChild(newContent); 
    
        if (dofeBadgeData) {
            const presidentAwardRow = newContent.children[1]; 

            const existingDofeBadges = presidentAwardRow.querySelectorAll('img[alt^="DOFE"]');
            existingDofeBadges.forEach(badge => badge.remove());
    
            const dofeImg = document.createElement('img');
            dofeImg.src = dofeBadgeData.imageUrl;
            dofeImg.alt = dofeBadgeData.badgeText; 
            presidentAwardRow.insertBefore(dofeImg, presidentAwardRow.children[2]); 
        }
    }

    function updateProgress(section, subMenuClass, totalItems, addSpace = true) {
        let selectedItems = 0;

        if (subMenuClass === 'sub-menu-right1') {
            const oneYearServiceValue = parseInt($('.one-year-service').val());
            selectedItems += oneYearServiceValue > 0 ? 1 : 0;
            selectedItems += $(`.${subMenuClass} .checkbox-right:checked`).length;

            $('.one-year-service').off('change').on('change', function () {
                const selectedValue = parseInt($(this).val());
                const selectedItemsWithOneYearService = selectedValue > 0 ? 1 : 0;
                selectedItems = selectedItemsWithOneYearService + $(`.${subMenuClass} .checkbox-right:checked`).length;
                updateProgress(section, subMenuClass, totalItems, addSpace);
                applySelection();
            });

        } else {
            const subMenu = $(`.${subMenuClass}`);
            const uniqueItems = new Set();

            subMenu.each(function () {
                const checkboxes = $(this).find('.checkbox:checked');
                const rightCheckboxes = $(this).find('.right-checkbox:checked');

                checkboxes.each(function () {
                    const parentItem = $(this).closest('.sub-item').attr('data-url');
                    uniqueItems.add(parentItem);
                });

                rightCheckboxes.each(function () {
                    const parentItem = $(this).closest('.sub-item').attr('data-url');
                    uniqueItems.add(parentItem);
                });
            });

            selectedItems = uniqueItems.size;
        }

        let progressNumber = `: ${selectedItems} / ${totalItems}`;
        if (addSpace) {
            progressNumber += '&nbsp;&nbsp;';
        }
        $(`.progress-row:contains(${section}) .progress-number`).html(progressNumber);
    }

    function updateSpecialAwardsProgress() {
        const selectedItems = $('.sub-menu-right2 .checkbox-right:checked').length;
        let progressNumber = `: ${selectedItems} / 8`;
        progressNumber += '&nbsp;&nbsp;';
        $(`.progress-row:contains(Special Awards) .progress-number`).html(progressNumber);
    }
    
    function updateTotalBasicProficiencyProgress() {
        const selectedItems = new Set();

        $('.checkbox:checked, .right-checkbox:checked').each(function () {
            const parentItem = $(this).closest('.sub-item').attr('data-url');
            selectedItems.add(parentItem);
        });

        let progressNumber = `: ${selectedItems.size} / 34`;
        progressNumber;
        $(`.progress-row:contains(Total Basic Proficiency Award) .progress-number`).html(progressNumber);
    }

    function updateTotalAdvancedProficiencyProgress() {
        const selectedItems = $('.right-checkbox:checked').length;
        let progressNumber = `: ${selectedItems} / 33`;
        progressNumber;
        $(`.progress-row:contains(Total Advanced Proficiency Award) .progress-number`).html(progressNumber);
    }

    function updateAllProgress() {
        updateProgress('Compulsory', 'sub-menu', 4);
        updateProgress('Interest (Group A)', 'sub-menu1', 12, false);
        updateProgress('Adventure (Group B)', 'sub-menu2', 3);
        updateProgress('Community (Group C)', 'sub-menu3', 9);
        updateProgress('Physical (Group D)', 'sub-menu4', 6);
        updateProgress('Service Awards', 'sub-menu-right1', 5);
        updateSpecialAwardsProgress();
        updateTotalBasicProficiencyProgress();
        updateTotalAdvancedProficiencyProgress();
    }

    function handleCheckboxChange() {
        applySelection(); 
        updateAllProgress();
        updateSpecialAwardsProgress(); 
    }

    $('.sub-item input.checkbox, .sub-item input.right-checkbox, .sub-item input.checkbox-right').on('change', function () {
        handleCheckboxChange();
    });

    updateAllProgress(); 
    applySelection();
});

document.addEventListener('change', function (event) {
    const targetCheckbox = event.target.closest('.checkbox, .right-checkbox, .checkbox-right');
    if (targetCheckbox) {
        handleCheckboxChange(targetCheckbox);
        updateOverallProgress();
    }
});

function updateGroupProgress(subMenuClass, groupName, count) {
    const progressBar = document.querySelector(`.president-container-box[title="${groupName}"] .progress-bar`);
    const progressNumber = document.querySelector(`.president-container-box[title="${groupName}"] .progress-number`);

    let currentCount = parseInt(progressNumber.textContent.split('/')[0]);
    let totalCount = parseInt(progressNumber.textContent.split('/')[1].split(' ')[0]);
    let updatedCount = currentCount + count;

    if (updatedCount < 0) {
        updatedCount = 0;
    } else if (updatedCount > totalCount) {
        updatedCount = totalCount;
    }

    let percentage = 0;
    if (totalCount !== 0) {
        percentage = Math.round((updatedCount / totalCount) * 100); 
    }

    progressBar.style.width = `${percentage}%`;
    progressNumber.textContent = `${updatedCount}/${totalCount} (${percentage}%)`; 
}

function updateOverallProgress() {
    const progressNumbers = document.querySelectorAll('.president-container-box .progress-number');
    const overallProgressBar = document.querySelector('.president-container-overall .progress-bar');
    const overallProgressNumber = document.querySelector('.president-container-overall .progress-number-overall');

    let totalCompleted = 0;
    let totalRequired = 23; 

    progressNumbers.forEach(progressNumber => {
        const [completed] = progressNumber.textContent.split('/')[0].split(' ');
        totalCompleted += parseInt(completed);
    });

    const overallPercentage = Math.round((totalCompleted / totalRequired) * 100);
    overallProgressBar.style.width = `${overallPercentage}%`;
    overallProgressNumber.textContent = `${overallPercentage}%`; 
}


function handleCheckboxChange(checkbox) {
    const targetCheckbox = document.querySelector('.sub-item[data-url="image/Right/Target.png"] .checkbox');
    const subItem = checkbox.closest('.sub-item');
    const subBoxText = subItem.querySelector('.sub-box-text').innerText.trim(); 

    const isSpecialBadge =
        subBoxText === "NCO PROFICIENCY" ||
        subBoxText === "THREE YEAR SERVICE BADGE" ||
        subBoxText === "NCO IN THE COMPANY"; 

    if (!isSpecialBadge && !targetCheckbox.checked) {
        updateNCOProgress();
        return;
    }

    const presidentBox = document.querySelector(`.president-container-box[title="${subBoxText}"]`);
    const checkedCheckboxes = document.querySelectorAll('.checkbox:checked:not(.ccheckbox-container .checkbox)').length;
    const checkedRightCheckboxes = document.querySelectorAll('.right-checkbox:checked:not(.ccheckbox-container .right-checkbox)').length;

    if (!checkbox.closest('.ccheckbox-container')) {
        if (checkbox.classList.contains('checkbox')) {
            if (checkbox.checked) {
                updateGroupProgress('.sub-menu .checkbox', '6 of Basic Proficiency Award', 1);
            } else {
                const advanceCheckbox = subItem.querySelector('.right-checkbox');
                if (advanceCheckbox.checked) {
                    advanceCheckbox.checked = false;
                    if (checkedRightCheckboxes <= 4) {
                        updateGroupProgress('.sub-menu .right-checkbox', '4 of Advanced Proficiency Award', -1);
                    }
                    if (checkedCheckboxes <= 5) {
                        updateGroupProgress('.sub-menu .checkbox', '6 of Basic Proficiency Award', -1);
                    }
                } else {
                    if (checkedCheckboxes <= 5) {
                        updateGroupProgress('.sub-menu .checkbox', '6 of Basic Proficiency Award', -1);
                    }
                }
            }
        } else if (checkbox.classList.contains('right-checkbox')) {
            const basicCheckbox = subItem.querySelector('.checkbox');
            if (checkbox.checked) {
                if (!basicCheckbox.checked) {
                    basicCheckbox.checked = true;
                    updateGroupProgress('.sub-menu .checkbox', '6 of Basic Proficiency Award', 1);
                }
                updateGroupProgress('.sub-menu .right-checkbox', '4 of Advanced Proficiency Award', 1);
            } else {
                if (basicCheckbox.checked) {
                    if (checkedRightCheckboxes <= 5) {
                        updateGroupProgress('.sub-menu .right-checkbox', '4 of Advanced Proficiency Award', -1);
                    }
                }
            }
        }

        if (checkbox.classList.contains('rank-checkbox')) {
            updateNCOProgress();
        }
}

    updateOverallProgress();
    updateSpecialProgress();
    updateNCOProgress();

    function updateNCOProgress() {
        const anyRankChecked = !!document.querySelector('.rank-checkbox:checked');
        const progressBar = document.querySelector('.president-container-box[title="NCO in the Company"] .progress-bar');
        const progressNumber = document.querySelector('.president-container-box[title="NCO in the Company"] .progress-number');
        progressBar.style.width = anyRankChecked ? '100%' : '0%';
        progressNumber.textContent = anyRankChecked ? '1/1 (100%)' : '0/1 (0%)';
    }
    
    function updateSpecialProgress() {
        const interestCheckboxes = document.querySelectorAll('.sub-menu1 .checkbox:checked, .sub-menu1 .right-checkbox:checked');
        const adventureCheckboxes = document.querySelectorAll('.sub-menu2 .checkbox:checked, .sub-menu2 .right-checkbox:checked');
        const communityCheckboxes = document.querySelectorAll('.sub-menu3 .checkbox:checked, .sub-menu3 .right-checkbox:checked');
        const physicalCheckboxes = document.querySelectorAll('.sub-menu4 .checkbox:checked, .sub-menu4 .right-checkbox:checked');
    
        if (interestCheckboxes.length > 0) {
            updateGroupProgress('.sub-menu1 .checkbox, .sub-menu1 .right-checkbox', 'Interest (Group A)', interestCheckboxes.length);
        } else {
            updateGroupProgress('.sub-menu1 .checkbox, .sub-menu1 .right-checkbox', 'Interest (Group A)', -1);
        }
    
        if (adventureCheckboxes.length > 0) {
            updateGroupProgress('.sub-menu2 .checkbox, .sub-menu2 .right-checkbox', 'Adventure (Group B)', adventureCheckboxes.length);
        } else {
            updateGroupProgress('.sub-menu2 .checkbox, .sub-menu2 .right-checkbox', 'Adventure (Group B)', -1);
        }
    
        if (communityCheckboxes.length > 0) {
            updateGroupProgress('.sub-menu3 .checkbox, .sub-menu3 .right-checkbox', 'Community (Group C)', communityCheckboxes.length);
        } else {
            updateGroupProgress('.sub-menu3 .checkbox, .sub-menu3 .right-checkbox', 'Community (Group C)', -1);
        }
    
        if (physicalCheckboxes.length > 0) {
            updateGroupProgress('.sub-menu4 .checkbox, .sub-menu4 .right-checkbox', 'Physical (Group D)', physicalCheckboxes.length);
        } else {
            updateGroupProgress('.sub-menu4 .checkbox, .sub-menu4 .right-checkbox', 'Physical (Group D)', -1);
        }
    }

    if (presidentBox) {
        const progressBar = presidentBox.querySelector('.progress-bar');
        const progressNumber = presidentBox.querySelector('.progress-number');
        
        const checkboxes = subItem.querySelectorAll('.checkbox');
        const rightCheckboxes = subItem.querySelectorAll('.right-checkbox');
        const checkboxesRight = subItem.querySelectorAll('.checkbox-right');
    
        if (subBoxText === 'RECRUITMENT') {
            if (checkbox.classList.contains('checkbox')) {
                if (checkbox.checked) {
                    progressBar.style.width = '100%';
                    progressNumber.textContent = '1/1 (100%)';
                } else if (!checkbox.checked && checkedRightCheckboxes.length > 0) {
                    progressBar.style.width = '0%';
                    progressNumber.textContent = '0/1 (0%)';
                } else {
                    progressBar.style.width = '0%';
                    progressNumber.textContent = '0/1 (0%)';
                }
            } else {
                if (checkbox.checked) {
                    progressBar.style.width = '100%';
                    progressNumber.textContent = '1/1 (100%)';
                } else {
                    progressBar.style.width = '100%';
                    progressNumber.textContent = '1/1 (100%)';
                }
            }
        updateOverallProgress();

        } else {
            const totalCheckboxes = checkboxes.length + rightCheckboxes.length + checkboxesRight.length;
            const checkedCheckboxes = Array.from(checkboxes).filter(cb => cb.checked);
            const checkedRightCheckboxes = Array.from(rightCheckboxes).filter(cb => cb.checked);
            const checkedCheckboxesRight = Array.from(checkboxesRight).filter(cb => cb.checked);    

            if ((subBoxText === 'CHRISTIAN EDUCATION' || subBoxText === 'DRILL')) {

                if (checkbox.classList.contains('checkbox')) {
                    if (checkedCheckboxes.length > 0 && checkedRightCheckboxes.length === 0) {
                        progressBar.style.width = '50%';
                        progressNumber.textContent = '1/2 (50%)';
                    } else if (checkedCheckboxes.length === 0 && checkedRightCheckboxes.length > 0) {
                        progressBar.style.width = '0%';
                        progressNumber.textContent = '0/2 (0%)';
                    } else if (checkedRightCheckboxes.length > 0) {
                        progressBar.style.width = '50%';
                        progressNumber.textContent = '1/2 (50%)';
                    } else {
                        progressBar.style.width = '0%';
                        progressNumber.textContent = '0/2 (0%)';
                    }
                } else if (checkbox.classList.contains('right-checkbox')) {
                    if (checkedRightCheckboxes.length > 0) {
                        progressBar.style.width = '100%';
                        progressNumber.textContent = '2/2 (100%)';
                    } else if (checkedCheckboxes.length > 0 && checkedRightCheckboxes.length === 0) {
                        progressBar.style.width = '50%';
                        progressNumber.textContent = '1/2 (50%)';
                    } else {
                        progressBar.style.width = '0%';
                        progressNumber.textContent = '0/2 (0%)';
                    }
                } else if (checkbox.classList.contains('checkbox-right')) {
                    if (checkedCheckboxes.length > 0 && checkedRightCheckboxes.length > 0) {
                        progressBar.style.width = '0%';
                        progressNumber.textContent = '0/2 (0%)';
                    } else if (checkedCheckboxesRight.length > 0) {
                        progressBar.style.width = '50%';
                        progressNumber.textContent = '1/2 (50%)';
                    } else {
                        progressBar.style.width = '0%';
                        progressNumber.textContent = '0/2 (0%)';
                    }
                }
            } else {
                const percentage = (checkedCheckboxes.length + checkedRightCheckboxes.length + checkedCheckboxesRight.length) / totalCheckboxes * 100;
                progressBar.style.width = `${percentage}%`;
                progressNumber.textContent = `${checkedCheckboxes.length + checkedRightCheckboxes.length + checkedCheckboxesRight.length}/${totalCheckboxes} (${percentage}%)`;
            }
            if ((subBoxText === 'NCO PROFICIENCY' || subBoxText === 'THREE YEAR SERVICE BADGE' || subBoxText === 'LONG YEAR SERVICE BADGE') && checkbox.classList.contains('checkbox-right') && checkedCheckboxesRight.length > 0) {
                progressBar.style.width = '100%';
                progressNumber.textContent = '1/1 (100%)';
            }
            updateOverallProgress();

        }
        applySelection(); 
        updateOverallProgress();
    }
}


document.addEventListener('change', function(event) {
    const target = event.target.closest('.rank-checkbox');
    if (target) handleRankCheckboxChange(target);
});

function handleRankCheckboxChange(checkbox) {
    const checkboxes = checkbox.closest('.sub-menu-right3').querySelectorAll('.rank-checkbox');
    checkboxes.forEach(other => { if (other !== checkbox) other.checked = false; });
    applyRankCSS();
}

function applyRankCSS() {
    const elements = {
        leftBox: document.querySelector('.left-box'),
        square: document.querySelector('.square'),
        triangle: document.querySelector('.triangle'),
        chevrons: [
            '.right-chevron-sideright1', '.right-chevron-sideleft1',
            '.right-chevron-sideright2', '.right-chevron-sideleft2',
            '.right-chevron-sideright3', '.right-chevron-sideleft3',
            '.right-chevron-sideright4', '.right-chevron-sideleft4'
        ].map(selector => document.querySelector(selector)),
        rightBox: document.querySelector('.right-box'),
        arm1: document.querySelector('.arm1')
    };

    // Get responsive dimensions
    const isMobile = window.innerWidth <= 768;
    const leftBoxWidth = parseInt(window.getComputedStyle(elements.leftBox).width, 10);
    const leftBoxHeight = parseInt(window.getComputedStyle(elements.leftBox).height, 9);

    const checkedCheckbox = document.querySelector('.rank-checkbox:checked');
    if (!checkedCheckbox) {
        elements.square.style.display = "none";
        elements.triangle.style.display = "none";
        elements.chevrons.forEach(chevron => chevron.style.display = "none");
        if (isMobile) {
            elements.leftBox.style.marginBottom = '';
            elements.rightBox.style.marginTop = '';
        }
        return;
    }

    const rank = checkedCheckbox.closest('.sub-item').querySelector('.sub-box-text').textContent.trim();
    
    // Desktop
    const desktopStyles = {
        'Lance Corporal': { squareHeight: 165, chevrons: 1 },
        'Corporal': { squareHeight: 215, chevrons: 2 },
        'Sergeant': { squareHeight: 265, chevrons: 3 },
        'Staff Sergeant': { squareHeight: 315, chevrons: 4 }
    };

    // Mobile
    const mobileStyles = {
        'Lance Corporal': { 
            squareHeight: 170, 
            chevrons: 1,
            chevronWidth: '47.395%',
            chevronHeight: 25,
            spacing: 35,
            margin: 10,
            triangleHeight: 50,
            bottomMargin: 250,
            moveUpAdjustment: -65
        },
        'Corporal': { 
            squareHeight: 205, 
            chevrons: 2,
            chevronWidth: '47.395%',
            chevronHeight: 25,
            spacing: 35,
            margin: 10,
            triangleHeight: 50,
            bottomMargin: 330,
            moveUpAdjustment: -100
        },
        'Sergeant': { 
            squareHeight: 235,
            chevrons: 3,
            chevronWidth: '47.395%',
            chevronHeight: 25,
            spacing: 35,
            margin: 10,
            triangleHeight: 50,
            bottomMargin: 390,
            moveUpAdjustment: -135
        },
        'Staff Sergeant': { 
            squareHeight: 270, 
            chevrons: 4, 
            chevronWidth: '47.395%', 
            chevronHeight: 25, 
            spacing: 35,
            margin: 10, 
            triangleHeight: 50,
            bottomMargin: 460,
            moveUpAdjustment: -170
        }
    };

    if (isMobile) {
        const { 
            squareHeight, 
            chevrons, 
            chevronWidth, 
            chevronHeight, 
            spacing, 
            margin, 
            triangleHeight, 
            bottomMargin,
            moveUpAdjustment 
        } = mobileStyles[rank];
        
        const halfWidth = leftBoxWidth / 2;

        elements.square.style.cssText = `
            display: block;
            width: ${leftBoxWidth}px;
            height: ${squareHeight}px;
            background: #2B2A2F; 
            border-left: ${halfWidth}px solid transparent; 
            border-right: ${halfWidth}px solid transparent; 
            position: absolute;
            top: ${leftBoxHeight}px;
            z-index: -1;
        `;

        elements.triangle.style.cssText = `
            display: block;
            width: 0;
            height: 0;
            border-left: ${halfWidth}px solid transparent; 
            border-right: ${halfWidth}px solid transparent; 
            border-top: ${triangleHeight}px solid #2B2A2F; 
            position: absolute;
            top: ${leftBoxHeight + squareHeight}px;
            z-index: 1;
        `;

        elements.chevrons.forEach(chevron => chevron.style.display = "none");

    for (let i = 1; i <= chevrons; i++) {
        const chevronOffset = leftBoxHeight + squareHeight + triangleHeight + ((i - 1) * spacing) + moveUpAdjustment;
        
        document.querySelector(`.right-chevron-sideright${i}`).style.cssText = `
            display: block;
            height: ${chevronHeight}px;
            width: ${chevronWidth};
            transform: skew(0deg, 15deg);
            background: white;
            left: 0;
            margin-left: ${margin}px;
            position: absolute;
            top: ${chevronOffset}px;
            z-index: 10;
        `;
        
        document.querySelector(`.right-chevron-sideleft${i}`).style.cssText = `
            display: block;
            height: ${chevronHeight}px;
            width: ${chevronWidth};
            transform: skew(0deg, -15deg);
            background: white;
            right: 0;
            margin-right: ${margin}px;
            position: absolute;
            top: ${chevronOffset}px;
            z-index: 10;
        `;
        }

        const adjustedBottomMargin = bottomMargin + moveUpAdjustment;
        elements.leftBox.style.marginBottom = `${Math.max(adjustedBottomMargin, 0)}px`;


    } else {
        //Desktop
        const { squareHeight, chevrons } = desktopStyles[rank];
        const halfWidth = leftBoxWidth / 2;
        const chevronWidth = 260;
        const chevronHeight = 40;
        const chevronMargin = 15;
        const chevronSpacing = 50;
        const triangleHeight = 95;

        elements.square.style.cssText = `
            display: block;
            width: ${leftBoxWidth}px;
            height: ${squareHeight}px;
            background: #2B2A2F; 
            border-left: ${halfWidth}px solid transparent; 
            border-right: ${halfWidth}px solid transparent; 
            position: absolute;
            top: ${leftBoxHeight}px;
            z-index: -1;
        `;

        elements.triangle.style.cssText = `
            display: block;
            width: 0;
            height: 0;
            border-left: ${halfWidth}px solid transparent; 
            border-right: ${halfWidth}px solid transparent; 
            border-top: ${triangleHeight}px solid #2B2A2F; 
            position: absolute;
            top: ${leftBoxHeight + squareHeight}px;
            z-index: 1;
        `;

        elements.chevrons.forEach(chevron => chevron.style.display = "none");

        for (let i = 1; i <= chevrons; i++) {
            let chevronOffset = leftBoxHeight + (i * chevronSpacing) + 105;
        
            document.querySelector(`.right-chevron-sideright${i}`).style.cssText = `
                display: block;
                height: ${chevronHeight}px;
                width: ${chevronWidth}px;
                transform: skew(0deg, 20deg);
                background: white;
                left: 0;
                margin-left: ${chevronMargin}px;
                position: absolute;
                top: ${chevronOffset}px;
                z-index: 10;
            `;
        
            document.querySelector(`.right-chevron-sideleft${i}`).style.cssText = `
                display: block;
                height: ${chevronHeight}px;
                width: ${chevronWidth}px;
                transform: skew(0deg, -20deg);
                background: white;
                right: 0;
                margin-right: ${chevronMargin}px;
                position: absolute;
                top: ${chevronOffset}px;
                z-index: 10;
            `;
        }

        elements.leftBox.style.marginBottom = '';
        elements.rightBox.style.marginTop = '';
        elements.arm1.style.marginTop = '';
    }
    
}

function updateRankDisplay() {
    const rankDisplay = document.querySelector('.progress-rank');
    const checkedCheckbox = document.querySelector('.sub-menu-right3 .rank-checkbox:checked');
    
    if (checkedCheckbox) {
        const rankText = checkedCheckbox.closest('.sub-item').querySelector('.sub-box-text').textContent;
        rankDisplay.textContent = rankText.trim();
    } else {
        rankDisplay.textContent = 'Private';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.rank-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            checkboxes.forEach(cb => {
                if (cb !== this) cb.checked = false;
            });
            updateRankDisplay();
        });
    });
    
    updateRankDisplay();
});

document.addEventListener('DOMContentLoaded', function () {
    // Init EmailJS
    emailjs.init("jwnrle_0zxuB29XxH"); 

    const feedbackModal = document.getElementById('feedbackModal');
    const openBtn = document.getElementById('openFeedbackBtn');
    const closeBtn = document.getElementById('closeFeedbackModal');
    const cancelBtn = document.getElementById('cancelFeedbackBtn');
    const submitBtn = document.getElementById('submitFeedbackBtn');
    const feedbackInput = document.getElementById('feedbackMessage');

    // Open modal
    openBtn.addEventListener('click', () => {
        feedbackModal.classList.add('active');
        document.body.classList.add('no-scroll'); // freeze background
    });

    // Close modal
    function closeFeedbackModalFunc() {
        feedbackModal.classList.remove('active');
        document.body.classList.remove('no-scroll'); // unfreeze background
    }

    closeBtn.addEventListener('click', closeFeedbackModalFunc);
    cancelBtn.addEventListener('click', closeFeedbackModalFunc);

    // Send feedback
    submitBtn.addEventListener('click', function () {
        const feedbackText = feedbackInput.value.trim();
        if (!feedbackText) {
            alert("Please write some feedback before sending.");
            return;
        }

        emailjs.send("service_9tjtma8", "template_k2kcz19", {
            message: feedbackText,
            to_email: "joshuang.ng2004@gmail.com",
        }).then(
            function (response) {
                console.log("Feedback sent:", response);
                alert("✅ Feedback sent successfully!");
                feedbackInput.value = "";
                closeFeedbackModalFunc(); // close + unfreeze
            },
            function (error) {
                console.error("Feedback failed:", error);
                alert("❌ Failed to send feedback. Please try again later.");
            }
        );
    });

    let supportButton = document.getElementById("supportBtn");
    let supportPopup = document.getElementById("support-popup");
    let closeButton = document.getElementById("supportClose");

    supportButton.addEventListener("click", function () {
        supportPopup.classList.add("active");
        document.body.classList.add("no-scroll"); 
    });

    closeButton.addEventListener("click", function () {
        supportPopup.classList.remove("active");
        document.body.classList.remove("no-scroll");
    });

    window.addEventListener("click", function (event) {
        if (event.target === supportPopup) {
            supportPopup.classList.remove("active");
            document.body.classList.remove("no-scroll");
        }
    });
});
