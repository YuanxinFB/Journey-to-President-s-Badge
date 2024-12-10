document.addEventListener('DOMContentLoaded', function () {
    side_baropen();

    document.getElementById('toggleSidebar').addEventListener('click', function () {
        toggleSidebar();
    });
    
    const subMenus = document.querySelectorAll('.sub-menu, .sub-menu1, .sub-menu2, .sub-menu3, .sub-menu4, .sub-menu-right1, .sub-menu-right2, .sub-menu-right3');
    subMenus.forEach(subMenu => {
        subMenu.style.display = 'none';
    });
    
    document.addEventListener('change', function (event) {
        const targetCheckbox = event.target.closest('.checkbox, .right-checkbox, check');
        if (targetCheckbox) {
            handleCheckboxChange(targetCheckbox);
        }
    });

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
    }

        document.getElementById('goToTopBtn').addEventListener('click', function () {
            scrollToTop();
        });
            
    function scrollToTop() {
        const scrollOptions = {
            top: 0,
            behavior: 'smooth'
        };
    
        window.scrollTo(scrollOptions);
    }

    document.addEventListener('change', function (event) {
        const targetCheckbox = event.target.closest('.checkbox, .right-checkbox, .checkbox-right');
        if (targetCheckbox) {
            handleCheckboxChange(targetCheckbox);
        }
    });


    // Initialize visit counter
    let visitCount = localStorage.getItem('visitCount') || 0;
    visitCount++;
    localStorage.setItem('visitCount', visitCount);

    // Fetch visitor information
    async function getVisitorInfo() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            // Send visit data to backend (to be implemented)
            logVisit(data.city, data.region, data.country_name);
        } catch (error) {
            console.error('Error fetching visitor info:', error);
        }
    }

    async function logVisit(city, region, country) {
        const visits = localStorage.getItem('visitCount') || 0;
        // Uncomment and implement this to send data to your backend
        /*
        await fetch('/log-visit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ visits: parseInt(visits), city, region, country }),
        });
        */
    }

    getVisitorInfo();

    // Convert input to uppercase on blur (when focus is lost)
    const editableDivs = document.querySelectorAll('.editable');
    editableDivs.forEach(div => {
        div.addEventListener('blur', function() {
            this.innerText = this.innerText.toUpperCase();
        });
    });

    document.getElementById('capture').addEventListener('click', function() {
        const name = document.getElementById('nametag-name').innerText.toUpperCase();
        const company = document.getElementById('nametag-company').innerText.toUpperCase();

        // Update the nametag with uppercase values
        document.getElementById('nametag-name').innerText = name || 'NAME';
        document.getElementById('nametag-company').innerText = company || 'COMPANY';

        // Capture the entire container instead of just the body
        html2canvas(document.getElementById('screenshot-container'), {
            scrollY: -window.scrollY,
            scale: window.devicePixelRatio,
            useCORS: true // Enable CORS for images
        }).then(function(canvas) {
            const img = document.createElement('img');
            img.src = canvas.toDataURL('image/png');

            const link = document.createElement('a');
            link.href = img.src;
            link.download = 'screenshot.png';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(function(error) {
            console.error('Error capturing screenshot:', error);
        });
    });



    const nameField = document.getElementById('nametag-name');
    const companyField = document.getElementById('nametag-company');
    const nametag = document.getElementById('nametag');

    // Restrict name field to 15 characters
    nameField.addEventListener('input', function () {
        const maxLength = 15;
        if (this.textContent.length > maxLength) {
            this.textContent = this.textContent.slice(0, maxLength);
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(this.childNodes[0], maxLength);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            alert("Cannot add any more characters.");
        }
    });

    // Toggle the nametag background color and font color
    // Toggle the nametag background color and font color
    nametag.addEventListener('click', function () {
        const currentColor = window.getComputedStyle(this).backgroundColor;

        if (currentColor === 'rgb(255, 255, 255)' || currentColor === 'white') { // White background
            this.style.backgroundColor = '#3498db'; // Set blue background
            this.style.color = '#ffffff'; // Set white font color
        } else { 
            this.style.backgroundColor = '#ffffff'; // Set white background
            this.style.color = '#000000'; // Set black font color
        }
    });






});




function side_baropen() {
    document.getElementById("side-bar").style.left = "0";
    document.body.classList.add('sidebar-open'); 
}

function side_barclose() {
    document.getElementById("side-bar").style.left = "-9999px";
    document.body.classList.add('sidebar-open'); 
}

function navigateTo(page) {
    window.location.href = page;
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

function clearAll() {
    const checkboxes = document.querySelectorAll('.sub-item input, .checkbox, .right-checkbox, .right-checkbox-none');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        bar.style.width = '0%';
    });

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

    const overallProgressBar = document.querySelector('.president-container-overall .progress-bar');
    const overallProgressNumber = document.querySelector('.president-container-overall .progress-number-overall');
    overallProgressBar.style.width = '0%';
    overallProgressNumber.textContent = '0%';

    const oneYearServiceSelect = document.getElementById('one-year-service');
    if (oneYearServiceSelect) {
        oneYearServiceSelect.value = '0';
    }

    const selectedBadgesContainer = document.getElementById('selectedBadgesContainer');
    selectedBadgesContainer.innerHTML = '';
    const rightBox = document.getElementById('rightBox');
    rightBox.innerHTML = '';

    const rankDisplay = document.querySelector('.progress-rank');
    rankDisplay.textContent = 'Private';

    const modal = document.getElementById('presidentAwardModal');
    if (modal.style.display === "block") {
        modal.style.display = "none";
    }

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

    applySelection();
    updateAllProgress();
    updateOverallProgress();
    updateRankDisplay();
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


$(document).ready(function () {
    function applySelection() {
        const selectedBadges = document.querySelectorAll('.sub-item input:checked');
        const selectedBadgesContainer = document.getElementById('selectedBadgesContainer');
        const rightBox = document.getElementById('rightBox');
        const linkBadgeContainer = document.getElementById('link-badge'); // Get the link-badge container
        const badgesData = [];
        let targetBadgeData = null;
        let dofeBadgeData = null; 
    
        let isLinkBadgeSelected = false;

        selectedBadges.forEach(badge => {
            const imageUrl = badge.closest('.sub-item').getAttribute('data-url');
            const badgeText = badge.closest('.sub-item').querySelector('.sub-box-text').innerText;
            const isRightSubMenu = badge.closest('.sub-menu-right1, .sub-menu-right2, .sub-menu-right3') !== null;
            const checkboxType = badge.classList.contains('right-checkbox') ? 'right-checkbox' : 'checkbox';
        
            // Handle LINK BADGE separately
            if (badgeText === 'LINK BADGE') {
                isLinkBadgeSelected = true; // Mark that LINK BADGE is selected
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = 'LINK BADGE';
                linkBadgeContainer.innerHTML = ''; // Clear any existing content
                linkBadgeContainer.appendChild(img); // Append the LINK BADGE image
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
        });
    
        // If LINK BADGE is not selected, clear the linkBadgeContainer
        if (!isLinkBadgeSelected) {
            linkBadgeContainer.innerHTML = ''; // Remove the LINK BADGE image if unchecked
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
    const subItem = checkbox.closest('.sub-item');
    const subBoxText = subItem.querySelector('.sub-box-text').innerText;
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
            if ((subBoxText === 'NCO PROFICIENCY' || subBoxText === 'THREE YEAR SERVICE BADGE') && checkbox.classList.contains('checkbox-right') && checkedCheckboxesRight.length > 0) {
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
    const leftBox = document.querySelector('.left-box');
    const square = document.querySelector('.square');
    const triangle = document.querySelector('.triangle');
    const rightChevrosideright1 = document.querySelector('.right-chevron-sideright1');
    const rightChevrosideleft1 = document.querySelector('.right-chevron-sideleft1');
    const rightChevrosideright2 = document.querySelector('.right-chevron-sideright2');
    const rightChevrosideleft2 = document.querySelector('.right-chevron-sideleft2');
    const rightChevrosideright3 = document.querySelector('.right-chevron-sideright3');
    const rightChevrosideleft3 = document.querySelector('.right-chevron-sideleft3');
    const rightChevrosideright4 = document.querySelector('.right-chevron-sideright4');
    const rightChevrosideleft4 = document.querySelector('.right-chevron-sideleft4');


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

    square.style.cssText = `
        display: none;
    `
    triangle.style.cssText = `
        display: none;
    `

    rightChevrosideright1.style.cssText = `
        display: none;
    `

    rightChevrosideleft1.style.cssText = `
        display: none;
    `

    rightChevrosideright2.style.cssText = `
        display: none;
    `

    rightChevrosideleft2.style.cssText = `
        display: none;
    `

    rightChevrosideright3.style.cssText = `
        display: none;
    `

    rightChevrosideleft3.style.cssText = `
        display: none;
    `

    rightChevrosideright4.style.cssText = `
        display: none;
    `

    rightChevrosideleft4.style.cssText = `
        display: none;
    `
    const checkedCheckbox = document.querySelector('.rank-checkbox:checked');
    if (checkedCheckbox) {
        const rank = checkedCheckbox.closest('.sub-item').querySelector('.sub-box-text').textContent.trim();
        switch (rank) {
            case 'Lance Corporal': 
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
                const square = document.querySelector('.square');
                square.style.cssText = `
                    width: 550px;
                    height: 60px;
                    background: #2B2A2F;
                    position: absolute;
                    margin-top: 720px;
                    z-index: -1;
                `;
                const triangle = document.querySelector('.triangle');
                triangle.style.cssText = `
                    width: 0;
                    height: 0;
                    border-left: 275px solid transparent; 
                    border-right: 275px solid transparent; 
                    border-top: 95px solid #2B2A2F;; 
                    z-index: 1;
                    position: absolute;
                    margin-top: 780px;
                `;
                const rightChevrosideright1 = document.querySelector('.right-chevron-sideright1');
                rightChevrosideright1.style.cssText = `    
                    text-align: center;
                    width: 520px;
                    position: absolute;
                    z-index: 100;            
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, 20deg);
                    background: white;
                    left: 0;    
                    margin-left: 15px;
                    top: 770px;
                `;
                const rightChevrosideleft1 = document.querySelector('.right-chevron-sideleft1');
                rightChevrosideleft1.style.cssText = `  
                    text-align: center;
                    width: 520px;
                    position: absolute;
                    z-index: 100;              
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, -20deg);
                    background: white;
                    right: 0;
                    margin-right: 15px;
                    top: 770px;
                `;

                break;
                
            case 'Corporal':
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
                const square1 = document.querySelector('.square');
                square1.style.cssText = `
                    width: 550px;
                    height: 110px;
                    background: #2B2A2F;
                    margin-top: 720px;
                    z-index: -1;
                    position: absolute;              
                `;
                const triangle1 = document.querySelector('.triangle');
                triangle1.style.cssText = `
                    width: 0;
                    height: 0;
                    border-left: 275px solid transparent; 
                    border-right: 275px solid transparent; 
                    border-top: 95px solid #2B2A2F;; 
                    z-index: 1;
                    position: absolute;
                    margin-top: 830px;
                `;
                const rightChevrosideright2 = document.querySelector('.right-chevron-sideright2');
                rightChevrosideright2.style.cssText = `    
                    text-align: center;
                    width: 520px;
                    position: absolute;
                    z-index: 100;            
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, 20deg);
                    background: white;
                    left: 0;    
                    margin-left: 15px;  
                    top: 820px;
                `;
                const rightChevrosideleft2 = document.querySelector('.right-chevron-sideleft2');
                rightChevrosideleft2.style.cssText = `  
                    text-align: center;
                    width: 520px;
                    position: absolute;
                    z-index: 100;              
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, -20deg);
                    background: white;
                    right: 0;
                    margin-right: 15px;
                    top: 820px;
                `;
                const rightChevrosideright3 = document.querySelector('.right-chevron-sideright1');
                rightChevrosideright3.style.cssText = `    
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, 20deg);
                    background: white;
                    left: 0;    
                    margin-left: 15px;
                    top: 770px;
                    z-index: 10;
                `;
                const rightChevrosideleft3 = document.querySelector('.right-chevron-sideleft1');
                rightChevrosideleft3.style.cssText = `              
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, -20deg);
                    background: white;
                    right: 0;
                    margin-right: 15px;
                    top: 770px;
                    z-index: 10;
                `;

                break;

            case 'Sergeant':
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
                const square2 = document.querySelector('.square');
                square2.style.cssText = `
                    width: 550px;
                    height: 160px;
                    background: #2B2A2F;
                    margin-top: 720px;
                    z-index: -1;
                    position: absolute;
                `;
                const triangle2 = document.querySelector('.triangle');
                triangle2.style.cssText = `
                    width: 0;
                    height: 0;
                    border-left: 275px solid transparent; 
                    border-right: 275px solid transparent; 
                    border-top: 95px solid #2B2A2F;; 
                    z-index: 1;
                    position: absolute;
                    margin-top: 880px;              
                `;
                const rightChevrosideright4 = document.querySelector('.right-chevron-sideright3');
                rightChevrosideright4.style.cssText = `    
                    text-align: center;
                    width: 520px;
                    position: absolute;
                    z-index: 100;            
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, 20deg);
                    background: white;
                    left: 0;    
                    margin-left: 15px;  
                    top: 870px;
                `;
                const rightChevrosideleft4 = document.querySelector('.right-chevron-sideleft3');
                rightChevrosideleft4.style.cssText = `  
                    text-align: center;
                    width: 520px;
                    position: absolute;
                    z-index: 100;              
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, -20deg);
                    background: white;
                    right: 0;
                    margin-right: 15px;
                    top: 870px;
                `;
                const rightChevrosideright5 = document.querySelector('.right-chevron-sideright1');
                rightChevrosideright5.style.cssText = `    
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, 20deg);
                    background: white;
                    left: 0;    
                    margin-left: 15px;
                    top: 770px;
                    z-index: 10;
                `;
                const rightChevrosideleft5 = document.querySelector('.right-chevron-sideleft1');
                rightChevrosideleft5.style.cssText = `              
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, -20deg);
                    background: white;
                    right: 0;
                    margin-right: 15px;
                    top: 770px;
                    z-index: 10;
                `;
                const rightChevrosideright6 = document.querySelector('.right-chevron-sideright2');
                rightChevrosideright6.style.cssText = `    
                    text-align: center;
                    width: 520px;
                    position: absolute;
                    z-index: 100;            
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, 20deg);
                    background: white;
                    left: 0;    
                    margin-left: 15px;  
                    top: 820px;
                `;
                const rightChevrosideleft6 = document.querySelector('.right-chevron-sideleft2');
                rightChevrosideleft6.style.cssText = `  
                    text-align: center;
                    width: 520px;
                    position: absolute;
                    z-index: 100;              
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, -20deg);
                    background: white;
                    right: 0;
                    margin-right: 15px;
                    top: 820px;
                `;

                break;

            case 'Staff Sergeant':
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
                const square3 = document.querySelector('.square');
                square3.style.cssText = `
                    width: 550px;
                    height: 210px;
                    background: #2B2A2F;
                    margin-top: 720px;
                    z-index: -1;
                    position: absolute;
                `;
                const triangle3 = document.querySelector('.triangle');
                triangle3.style.cssText = `
                    width: 0;
                    height: 0;
                    border-left: 275px solid transparent; 
                    border-right: 275px solid transparent; 
                    border-top: 95px solid #2B2A2F;; 
                    z-index: 1;       
                    position: absolute;
                    margin-top: 930px;      
                `;
                const rightChevrosideright7 = document.querySelector('.right-chevron-sideright4');
                rightChevrosideright7.style.cssText = `    
                    text-align: center;
                    width: 520px;
                    position: absolute;
                    z-index: 100;            
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, 20deg);
                    background: white;
                    left: 0;    
                    margin-left: 15px;  
                    top: 920px;
                `;
                const rightChevrosideleft7 = document.querySelector('.right-chevron-sideleft4');
                rightChevrosideleft7.style.cssText = `  
                    text-align: center;
                    width: 520px;
                    position: absolute;
                    z-index: 100;              
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, -20deg);
                    background: white;
                    right: 0;
                    margin-right: 15px;
                    top: 920px;
                `;
                const rightChevrosideright8 = document.querySelector('.right-chevron-sideright1');
                rightChevrosideright8.style.cssText = `    
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, 20deg);
                    background: white;
                    left: 0;    
                    margin-left: 15px;
                    top: 770px;
                    z-index: 10;
                `;
                const rightChevrosideleft8 = document.querySelector('.right-chevron-sideleft1');
                rightChevrosideleft8.style.cssText = `              
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, -20deg);
                    background: white;
                    right: 0;
                    margin-right: 15px;
                    top: 770px;
                    z-index: 10;
                `;
                const rightChevrosideright9 = document.querySelector('.right-chevron-sideright2');
                rightChevrosideright9.style.cssText = `    
                    text-align: center;
                    width: 520px;
                    position: absolute;
                    z-index: 100;            
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, 20deg);
                    background: white;
                    left: 0;    
                    margin-left: 15px;  
                    top: 820px;
                `;
                const rightChevrosideleft9 = document.querySelector('.right-chevron-sideleft2');
                rightChevrosideleft9.style.cssText = `  
                    text-align: center;
                    width: 520px;
                    position: absolute;
                    z-index: 100;              
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, -20deg);
                    background: white;
                    right: 0;
                    margin-right: 15px;
                    top: 820px;
                `;
                const rightChevrosideright10 = document.querySelector('.right-chevron-sideright3');
                rightChevrosideright10.style.cssText = `    
                    text-align: center;
                    width: 520px;
                    position: absolute;
                    z-index: 100;            
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, 20deg);
                    background: white;
                    left: 0;    
                    margin-left: 15px;  
                    top: 870px;
                `;
                const rightChevrosideleft10 = document.querySelector('.right-chevron-sideleft3');
                rightChevrosideleft10.style.cssText = `  
                    text-align: center;
                    width: 520px;
                    position: absolute;
                    z-index: 100;              
                    content: '';
                    position: absolute;
                    height: 40px;
                    width: 260px;
                    transform: skew(0deg, -20deg);
                    background: white;
                    right: 0;
                    margin-right: 15px;
                    top: 870px;
                `;

                break;

        }
    }
}

document.addEventListener('change', function(event) {
    const checkedCheckbox = document.querySelector('.rank-checkbox:checked');
    
    if (checkedCheckbox) {
        const rank = checkedCheckbox.closest('.sub-item').querySelector('.sub-box-text').textContent.trim();
        
        const progressbox = document.getElementById('selectedCount');
        switch (rank) {
            case 'Lance Corporal':
                progressbox.style.marginTop = '130px';
                break;
            case 'Corporal':
                progressbox.style.marginTop = '180px';
                break;
            case 'Sergeant':
                progressbox.style.marginTop = '230px';
                break;
            case 'Staff Sergeant':
                progressbox.style.marginTop = '280px';
                break;
            default:
                progressbox.style.marginTop = '0';
                break;
        }
    } else {

        const progressbox = document.getElementById('selectedCount');
        progressbox.style.marginTop = '0'; 
    }

    function updateRankDisplay() {
        const rankDisplay = document.querySelector('.progress-rank'); 
        const checkedCheckbox = document.querySelector('.sub-menu-right3 .rank-checkbox:checked'); 
        
        if (checkedCheckbox) {
            const rank = checkedCheckbox.closest('.sub-item').querySelector('.sub-box-text').textContent.trim();
            rankDisplay.textContent = rank;
        } else {
            rankDisplay.textContent = 'Private';
        }
    }

    document.querySelectorAll('.sub-menu-right3 .rank-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateRankDisplay);
    });

    updateRankDisplay();

});


document.getElementById('badge-checkbox').addEventListener('change', function() {
    const badgeContainer = document.getElementById('link-badge');
    const badgeImage = document.getElementById('badge-image');

    if (this.checked) {
        badgeContainer.innerHTML = `<img src="${badgeImage.src}" alt="LINK BADGE"> LINK BADGE`;
    } else {
        badgeContainer.textContent = 'Link Badge';
    }
});
