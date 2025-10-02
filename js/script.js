document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const currentPage = window.location.pathname.toLowerCase();
    const isWeekly = currentPage.includes('weeklysch.html');
    const isWorkings = currentPage.includes('workings.html');
    let selectedLabel = null;

    // Select all labels and dropzones
    const labels = document.querySelectorAll('.label, .label-list .label, .sidebar .label');
    const dropzones = document.querySelectorAll('.droppable, .dropzone, td:not(:first-child):not(:last-child)');
    const addPersonBtn = document.querySelector('.add-person, .add-btn');

    // Log if selectors fail
    if (!labels.length) console.warn('No labels found. Check if .label class is applied correctly.');
    if (!dropzones.length) console.warn('No dropzones found. Check if .droppable or .dropzone classes are applied correctly.');

    if (isMobile && (isWeekly || isWorkings)) {
        // Mobile: Typing functionality for weeklysch.html and workings.html
        dropzones.forEach(zone => {
            zone.addEventListener('click', () => {
                // If an input already exists, do nothing
                if (zone.querySelector('input')) return;

                // Create input field
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'editable-input';
                input.placeholder = 'Type name...';
                zone.innerHTML = ''; // Clear existing content
                zone.appendChild(input);
                input.focus();

                // Save on Enter or blur
                const saveInput = () => {
                    const name = input.value.trim();
                    if (name) {
                        const li = document.createElement('li');
                        li.textContent = name;
                        li.classList.add('dropped');
                        const deleteBtn = document.createElement('span');
                        deleteBtn.textContent = '×';
                        deleteBtn.className = 'delete-btn';
                        deleteBtn.addEventListener('click', () => li.remove());
                        li.appendChild(deleteBtn);
                        const ul = zone.querySelector('ul') || document.createElement('ul');
                        if (!zone.querySelector('ul')) zone.appendChild(ul);
                        ul.appendChild(li);
                    }
                    zone.innerHTML = ''; // Clear input
                    if (zone.querySelector('ul')) zone.appendChild(zone.querySelector('ul'));
                };

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') saveInput();
                });
                input.addEventListener('blur', saveInput);
            });
        });
    } else if (isMobile) {
        // Mobile: Click-to-select for index.html
        labels.forEach(label => {
            label.addEventListener('click', () => {
                if (selectedLabel === label) {
                    label.classList.remove('selected');
                    selectedLabel = null;
                    dropzones.forEach(zone => zone.classList.remove('highlighted'));
                } else {
                    if (selectedLabel) selectedLabel.classList.remove('selected');
                    selectedLabel = label;
                    label.classList.add('selected');
                    dropzones.forEach(zone => zone.classList.add('highlighted'));
                }
            });
        });

        dropzones.forEach(zone => {
            zone.addEventListener('click', () => {
                if (selectedLabel) {
                    const li = document.createElement('li');
                    li.textContent = selectedLabel.textContent.replace('×', '').trim();
                    li.classList.add('dropped');
                    const deleteBtn = document.createElement('span');
                    deleteBtn.textContent = '×';
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.addEventListener('click', () => li.remove());
                    li.appendChild(deleteBtn);
                    const ul = zone.querySelector('ul') || document.createElement('ul');
                    if (!zone.querySelector('ul')) zone.appendChild(ul);
                    ul.appendChild(li);
                    selectedLabel.classList.remove('selected');
                    selectedLabel = null;
                    dropzones.forEach(z => z.classList.remove('highlighted'));
                }
            });
        });
    } else {
        // Desktop: Drag-and-drop for all pages
        labels.forEach(label => {
            label.draggable = true;
            label.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', label.textContent);
                label.classList.add('dragging');
            });
            label.addEventListener('dragend', () => {
                label.classList.remove('dragging');
            });
        });

        dropzones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('highlighted');
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('highlighted');
            });
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('highlighted');
                const data = e.dataTransfer.getData('text/plain');
                const li = document.createElement('li');
                li.textContent = data.replace('×', '').trim();
                li.classList.add('dropped');
                const deleteBtn = document.createElement('span');
                deleteBtn.textContent = '×';
                deleteBtn.className = 'delete-btn';
                deleteBtn.addEventListener('click', () => li.remove());
                li.appendChild(deleteBtn);
                const ul = zone.querySelector('ul') || document.createElement('ul');
                if (!zone.querySelector('ul')) zone.appendChild(ul);
                ul.appendChild(li);
            });
        });
    }

    // Handle add-person/add-btn button
    if (addPersonBtn) {
        addPersonBtn.addEventListener('click', () => {
            const name = prompt('Enter new person name:');
            if (name) {
                const labelList = document.querySelector('.label-list, .sidebar, .labelContainer');
                if (!labelList) {
                    console.warn('No label container found for adding new person.');
                    return;
                }
                const newLabel = document.createElement('div');
                newLabel.className = 'label';
                newLabel.textContent = name;
                const deleteBtn = document.createElement('span');
                deleteBtn.textContent = '×';
                deleteBtn.className = 'delete-btn';
                deleteBtn.addEventListener('click', () => newLabel.remove());
                newLabel.appendChild(deleteBtn);
                if (!isMobile) {
                    newLabel.draggable = true;
                    newLabel.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', newLabel.textContent);
                        newLabel.classList.add('dragging');
                    });
                    newLabel.addEventListener('dragend', () => {
                        newLabel.classList.remove('dragging');
                    });
                }
                if (isMobile && !isWeekly && !isWorkings) {
                    newLabel.addEventListener('click', () => {
                        if (selectedLabel === newLabel) {
                            newLabel.classList.remove('selected');
                            selectedLabel = null;
                            dropzones.forEach(zone => zone.classList.remove('highlighted'));
                        } else {
                            if (selectedLabel) selectedLabel.classList.remove('selected');
                            selectedLabel = newLabel;
                            newLabel.classList.add('selected');
                            dropzones.forEach(zone => zone.classList.add('highlighted'));
                        }
                    });
                }
                labelList.appendChild(newLabel);
            }
        });
    } else {
        console.warn('No add-person or add-btn found.');
    }
});