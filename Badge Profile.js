document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
        const targetButton = event.target.closest('button');
        if (targetButton) {
            const buttonId = targetButton.id;
            switch (buttonId) {
                case 'goBack':
                    navigateTo('index.html');
                    break;
                case 'goToCheck':
                    navigateTo('Badge Profile.html');
                    break;
                default:
                    break;
            }
        }
    });

    // Open sidebar
    side_baropen();

    document.getElementById('toggleSidebar').addEventListener('click', function () {
        toggleSidebar();
    });
    
    const subMenus = document.querySelectorAll('.sub-menu, .sub-menu1, .sub-menu2, .sub-menu3, .sub-menu4, .sub-menu-right1, .sub-menu-right2');
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
            setTimeout(updateProgressNumbers, 100);
        }
    });
});

    function side_baropen() {
        document.getElementById("side-bar").style.left = "0";
        document.body.classList.add('sidebar-open'); 
    }

    function side_barclose() {
        document.getElementById("side-bar").style.left = "-500px";
        document.body.classList.add('sidebar-open'); 
    }

    function toggleSidebar() {
        var sidebar = document.getElementById("side-bar");
        var isOpen = sidebar.style.left === "0px" || sidebar.style.left === "";

        if (isOpen) {
            side_barclose();
        } else {
            side_baropen();
        }
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
    // Toggle submenu button
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
        const checkboxes = document.querySelectorAll('.sub-item input, .checkbox, .right-checkbox, .right-checkbox-none, .progress-number , .progress-bar');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            bar.style.width = '0%';
        });
    
        const progressNumbers = document.querySelectorAll('.progress-number');
        progressNumbers.forEach(number => {
            const total = number.textContent.split('/')[1].split(' ')[0];
            number.textContent = `0/${total} (0%)`;
        });
        applySelection();
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

    function applySelection() {
        const selectedBadges = document.querySelectorAll('.sub-item input:checked');
        const selectedBadgesContainer = document.getElementById('selectedBadgesContainer');
        const rightBox = document.getElementById('rightBox');
        const badgesData = [];
        let targetBadgeData = null; 

        selectedBadges.forEach(badge => {
            const imageUrl = badge.closest('.sub-item').getAttribute('data-url');
            const badgeText = badge.closest('.sub-item').querySelector('.sub-box-text').innerText;
            const isRightSubMenu = badge.closest('.sub-menu-right1, .sub-menu-right2') !== null;
            const checkboxType = badge.classList.contains('right-checkbox') ? 'right-checkbox' : 'checkbox';

            if (badgeText === 'TARGET') {
                targetBadgeData = {
                    imageUrl: imageUrl,
                    badgeText: badgeText,
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

        badgesData.sort((a, b) => {
            return a.badgeText.localeCompare(b.badgeText);
        });

        if (targetBadgeData) {
            badgesData.unshift(targetBadgeData);
        }

        // Clear previous selection
        selectedBadgesContainer.innerHTML = '';
        rightBox.innerHTML = '';

        // Display sorted badges in the appropriate container
        badgesData.forEach((badgeData, index) => {
            const img = document.createElement('img');
            img.src = badgeData.imageUrl;

            if (!badgeData.isRightSubMenu) {
                // If the badge is not from .sub-menu1, display it in the left box
                if (badgeData.checkboxType === 'right-checkbox') {
                    // Check if the badge is already displayed in the selectedBadgesContainer
                    const existingRightBadge = selectedBadgesContainer.querySelector(`img[src="${badgeData.imageUrl}"]`);

                    if (existingRightBadge) {
                        // Update the checkbox type for the existing badge
                        existingRightBadge.classList.remove('checkbox-only');
                        existingRightBadge.classList.add('red-cloth');
                    } else {
                        // If "right-checkbox" is checked, display one time of the badge with red cloth
                        img.classList.add('red-cloth');
                        selectedBadgesContainer.appendChild(img);
                    }
                } else {
                    // Display the regular badge in the selectedBadgesContainer
                    selectedBadgesContainer.appendChild(img);

                    // Special layout for the first five badges
                    if (index < 5) {
                        img.classList.add('leftmost-badge');
                    } else {
                        img.classList.add('centered-badge');
                    }
                }
            }
    });
   
    const hasThreeYearServiceBadge = badgesData.some(b => b.badgeText === "THREE YEAR SERVICE BADGE");
    const hasLongYearServiceBadge = badgesData.some(b => b.badgeText === "LONG YEAR SERVICE BADGE");
    
    let layoutStructure;
    if (!hasThreeYearServiceBadge && !hasLongYearServiceBadge) {
        layoutStructure = [
            [null, null, "FOUNDER’S AWARD", null, null],
            [null, "PRESIDENT’S AWARD", "DOE", "GOLD AWARD", null],
            [null, "GOLD SCHOLASTIC AWARDS", "SILVER SCHOLASTIC AWARDS", "BRONZE SCHOLASTIC AWARDS", null],
            [null, "LONG YEAR SERVICE BADGE", "NCO PROFICIENCY", "THREE YEAR SERVICE BADGE", null],
            [null, "JUNIOR SECTION SERVICE BADGE", "ONE YEAR SERVICE BADGE", null, null]
        ];
    } else if (hasThreeYearServiceBadge) {
        layoutStructure = [
            [null, null, "FOUNDER’S AWARD", null, null],
            [null, "PRESIDENT’S AWARD", "DOE", "GOLD AWARD", null],
            [null, "GOLD SCHOLASTIC AWARDS", "SILVER SCHOLASTIC AWARDS", "BRONZE SCHOLASTIC AWARDS", null],
            [null, "LONG YEAR SERVICE BADGE", "NCO PROFICIENCY", "THREE YEAR SERVICE BADGE", null],
            [null, "JUNIOR SECTION SERVICE BADGE", "ONE YEAR SERVICE BADGE", "ONE YEAR SERVICE BADGE", "ONE YEAR SERVICE BADGE", null]
        ];
    } if (hasLongYearServiceBadge && hasThreeYearServiceBadge) {
        layoutStructure = [
            [null, null, "FOUNDER’S AWARD", null, null],
            [null, "PRESIDENT’S AWARD", "DOE", "GOLD AWARD", null],
            [null, "GOLD SCHOLASTIC AWARDS", "SILVER SCHOLASTIC AWARDS", "BRONZE SCHOLASTIC AWARDS", null],
            [null, "LONG YEAR SERVICE BADGE", "NCO PROFICIENCY", "THREE YEAR SERVICE BADGE", null],
            ["JUNIOR SECTION SERVICE BADGE", "ONE YEAR SERVICE BADGE", "ONE YEAR SERVICE BADGE", "ONE YEAR SERVICE BADGE", "ONE YEAR SERVICE BADGE", "ONE YEAR SERVICE BADGE"]
        ];
    } else if (hasLongYearServiceBadge) {
        layoutStructure = [
            [null, null, "FOUNDER’S AWARD", null, null],
            [null, "PRESIDENT’S AWARD", "DOE", "GOLD AWARD", null],
            [null, "GOLD SCHOLASTIC AWARDS", "SILVER SCHOLASTIC AWARDS", "BRONZE SCHOLASTIC AWARDS", null],
            [null, "LONG YEAR SERVICE BADGE", "NCO PROFICIENCY", "THREE YEAR SERVICE BADGE", null],
            ["JUNIOR SECTION SERVICE BADGE", "ONE YEAR SERVICE BADGE", "ONE YEAR SERVICE BADGE", "ONE YEAR SERVICE BADGE", "ONE YEAR SERVICE BADGE", "ONE YEAR SERVICE BADGE"]
        ];
    }

    renderRightBox(rightBox, badgesData, layoutStructure);
}

function renderRightBox(rightBox, badgesData, layoutStructure) {
    layoutStructure.forEach(rowData => {
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('right-box-row');
        rowData.forEach(badgeText => {
            const badgeData = badgesData.find(b => b.badgeText === badgeText);

            if (badgeData) {
                const img = document.createElement('img');
                img.src = badgeData.imageUrl;
                rowContainer.appendChild(img);
            } else if (badgeText === null) {
                const emptySpace = document.createElement('div');
                emptySpace.classList.add('empty-space');
                rowContainer.appendChild(emptySpace);
            } else {
                const horizontalLine = document.createElement('hr');
                rowContainer.appendChild(horizontalLine);
            }
        });
        rightBox.appendChild(rowContainer);
    });

    $(document).ready(function () {
        updateProgress('Compulsory', 'sub-menu .checkbox:checked, sub-menu .right-checkbox:checked', 4);
        updateProgress('Interest (Group A)', 'sub-menu1 .checkbox:checked, sub-menu1 .right-checkbox:checked', 11, false); 
        updateProgress('Adventure (Group B)', 'sub-menu2 .checkbox:checked, sub-menu2 .right-checkbox:checked', 3);
        updateProgress('Community (Group C)', 'sub-menu3 .checkbox:checked, sub-menu3 .right-checkbox:checked', 7);
        updateProgress('Physical (Group D)', 'sub-menu4 .checkbox:checked, sub-menu4 .right-checkbox:checked', 6);
        updateProgress('Service Awards', 'sub-menu-right1', 4);
        updateProgress('Special Awards', 'sub-menu-right2', 8);
        updateProgress('Total Basic Proficiency Award', 'sub-menu .checkbox:checked, .sub-menu1 .checkbox:checked, .sub-menu2 .checkbox:checked, .sub-menu3 .checkbox:checked, .sub-menu4 .checkbox:checked, .sub-menu4 .checkbox-right:checked ', 31, false); 
        updateProgress('Total Advance Proficiency Award', 'sub-menu .right-checkbox:checked, .sub-menu1 .right-checkbox:checked, .sub-menu2 .right-checkbox:checked, .sub-menu3 .right-checkbox:checked, .sub-menu4 .right-checkbox:checked, .sub-menu4 .checkbox-right:checked', 30, false); 
          
        function updateProgress(section, subMenuClass, totalItems, addSpace = true) {
            const selectedItems = $(`.${subMenuClass} .checkbox:checked, .${subMenuClass} .right-checkbox:checked, .${subMenuClass} .checkbox-right:checked`).length;
            let progressNumber = `: ${selectedItems} / ${totalItems}`;
            if (addSpace) {
                progressNumber += '&nbsp;&nbsp;';
            }
            $(`.progress-row:contains(${section}) .progress-number`).html(progressNumber);
        }
    });
      
}

document.addEventListener('change', function (event) {
    const targetCheckbox = event.target.closest('.checkbox, .right-checkbox, .checkbox-right');
    if (targetCheckbox) {
        handleCheckboxChange(targetCheckbox);
        setTimeout(updateProgressNumbers, 100);
    }
});

function updateGroupProgress(subMenuClass, groupName,) {
    const subMenuCheckboxes = document.querySelectorAll(`.${subMenuClass} .checkbox, .${subMenuClass} .right-checkbox`);
    const progressBar = document.querySelector(`.president-container-box[title="${groupName}"] .progress-bar`);
    const progressNumber = document.querySelector(`.president-container-box[title="${groupName}"] .progress-number`);
    const checkedCheckboxes = Array.from(subMenuCheckboxes).filter(cb => cb.checked);

    if (checkedCheckboxes.length > 0) {
        progressBar.style.width = '100%';
        progressNumber.textContent = `1/1 (100%)`;
    } else {
        progressBar.style.width = '0%';
        progressNumber.textContent = `0/1 (0%)`;
    }
}

function updateGroupProgress(subMenuClass, groupName, count) {
    const subMenuCheckboxes = document.querySelectorAll(subMenuClass);
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

    const percentage = Math.round((updatedCount / totalCount) * 100); // Round percentage to nearest whole number
    progressBar.style.width = `${percentage}%`;
    progressNumber.textContent = `${updatedCount}/${totalCount} (${percentage}%)`; // Display rounded percentage
}

function handleCheckboxChange(checkbox) {
    const subItem = checkbox.closest('.sub-item');
    const subBoxText = subItem.querySelector('.sub-box-text').innerText;
    const presidentBox = document.querySelector(`.president-container-box[title="${subBoxText}"]`);
    const allCheckboxes = document.querySelectorAll('.checkbox');
    const checkedCheckboxes = document.querySelectorAll('.checkbox:checked:not(.ccheckbox-container .checkbox)').length;
    const allRightCheckboxes = document.querySelectorAll('.right-checkbox');
    const checkedRightCheckboxes = document.querySelectorAll('.right-checkbox:checked:not(.ccheckbox-container .right-checkbox)').length;
    
    if (!checkbox.closest('.ccheckbox-container')) {

        if (checkbox.classList.contains('checkbox')) {
            if (checkbox.checked) {
                updateGroupProgress('.sub-menu .checkbox', '6 of Basic Proficiency Award', 1);
                
            } else {
                const advanceCheckbox = subItem.querySelector('.right-checkbox');
                if (advanceCheckbox.checked) {
                    advanceCheckbox.checked = false;
                    // Check the total number of .right-checkbox elements checked before decrementing
                    if (checkedRightCheckboxes <= 4) {
                        updateGroupProgress('.sub-menu .right-checkbox', '4 of Advance Proficiency Award', -1);
                    }
                    if (checkedCheckboxes <= 5) {
                    updateGroupProgress('.sub-menu .checkbox', '6 of Basic Proficiency Award', -1);
                }
                } else {
                    // Only decrement if the total number of .checkbox elements checked is less than or equal to 10
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
                    updateGroupProgress('.sub-menu .checkbox', '6 of Basic Proficiency Award', 1); // staraight away press Advance
                }
                updateGroupProgress('.sub-menu .right-checkbox', '4 of Advance Proficiency Award', 1); // staraight away press Advance
            } else {
                if (basicCheckbox.checked) {
                    // Only decrement the total count if the total checked right-checkboxes is less than or equal to 6
                    if (checkedRightCheckboxes <= 5) {
                        updateGroupProgress('.sub-menu .right-checkbox', '4 of Advance Proficiency Award', -1); //cancel advance only
                    }
                }
            }
        }
    }

    updateSpecialProgress(); 
    
    function updateSpecialProgress() {
        const interestCheckboxes = document.querySelectorAll('.sub-menu1 .checkbox:checked, .sub-menu1 .right-checkbox:checked');
        const adventureCheckboxes = document.querySelectorAll('.sub-menu2 .checkbox:checked, .sub-menu2 .right-checkbox:checked');
        const communityCheckboxes = document.querySelectorAll('.sub-menu3 .checkbox:checked, .sub-menu3 .right-checkbox:checked');
        const physicalCheckboxes = document.querySelectorAll('.sub-menu4 .checkbox:checked, .sub-menu4 .right-checkbox:checked');
    
        // Interest (Group A)
        if (interestCheckboxes.length > 0) {
            updateGroupProgress('.sub-menu1 .checkbox, .sub-menu1 .right-checkbox', 'Interest (Group A)', interestCheckboxes.length);
        } else {
            updateGroupProgress('.sub-menu1 .checkbox, .sub-menu1 .right-checkbox', 'Interest (Group A)', -1);
        }
    
        // Adventure (Group B)
        if (adventureCheckboxes.length > 0) {
            updateGroupProgress('.sub-menu2 .checkbox, .sub-menu2 .right-checkbox', 'Adventure (Group B)', adventureCheckboxes.length);
        } else {
            updateGroupProgress('.sub-menu2 .checkbox, .sub-menu2 .right-checkbox', 'Adventure (Group B)', -1);
        }
    
        // Community (Group C)
        if (communityCheckboxes.length > 0) {
            updateGroupProgress('.sub-menu3 .checkbox, .sub-menu3 .right-checkbox', 'Community (Group C)', communityCheckboxes.length);
        } else {
            updateGroupProgress('.sub-menu3 .checkbox, .sub-menu3 .right-checkbox', 'Community (Group C)', -1);
        }
    
        // Physical (Group D)
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
    
        // Special handling for "RECRUITMENT"
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
        } else {
            const totalCheckboxes = checkboxes.length + rightCheckboxes.length + checkboxesRight.length;
            const checkedCheckboxes = Array.from(checkboxes).filter(cb => cb.checked);
            const checkedRightCheckboxes = Array.from(rightCheckboxes).filter(cb => cb.checked);
            const checkedCheckboxesRight = Array.from(checkboxesRight).filter(cb => cb.checked);    

            // Special handling for "CHRISTIAN EDUCATION" and "DRILL"
            if ((subBoxText === 'CHRISTIAN EDUCATION' || subBoxText === 'DRILL')) {
                const totalRightCheckboxes = rightCheckboxes.length + checkboxesRight.length;

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
                // Calculate percentage and update progress bar and progress number
                const percentage = (checkedCheckboxes.length + checkedRightCheckboxes.length + checkedCheckboxesRight.length) / totalCheckboxes * 100;
                progressBar.style.width = `${percentage}%`;
                progressNumber.textContent = `${checkedCheckboxes.length + checkedRightCheckboxes.length + checkedCheckboxesRight.length}/${totalCheckboxes} (${percentage}%)`;
            }
            // Additional handling for "NCO PROFICIENCY" and "THREE YEAR SERVICE BADGE"
            if ((subBoxText === 'NCO PROFICIENCY' || subBoxText === 'THREE YEAR SERVICE BADGE') && checkbox.classList.contains('checkbox-right') && checkedCheckboxesRight.length > 0) {
                progressBar.style.width = '100%';
                progressNumber.textContent = '1/1 (100%)';
            }

        }
        applySelection(); 
    }
}
