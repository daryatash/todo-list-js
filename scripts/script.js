class ToDoList {
  selectors = {
    modalOverlay: "[data-js-modal-overlay]",
    openModalButton: "[data-js-modal-overlay-open-button]",
    closeModalButton: "[data-js-modal-overlay-close-button]",
    noteForm: "[data-js-modal-overlay-form]",
    noteInput: "[data-js-modal-overlay-input]",
    notesList: "[data-js-notes-list]",
    emptyState: "[data-js-notes-empty]",
    searchForm: "[data-js-search-form]",
    searchInput: "[data-js-search-input]",
    select: "[data-js-select]",
    note: "[data-js-note]",
    noteLabel: "[data-js-note-label]",
    checkbox: "[data-js-note-checkbox]",
    deleteButton: "[data-js-note-delete-button]",
    editButton: "[data-js-note-edit-button]",
    themeToggleButton: "[data-js-theme-toggle-button]",
  };

  localStorageKey = "notes";

  constructor() {
    this.modalOverlayElement = document.querySelector(this.selectors.modalOverlay);
    this.openModalButtonElement = document.querySelector(this.selectors.openModalButton);
    this.closeModalButtonElement = document.querySelector(this.selectors.closeModalButton);
    this.noteFormElement = document.querySelector(this.selectors.noteForm);
    this.noteInputElement = document.querySelector(this.selectors.noteInput);
    this.notesListElement = document.querySelector(this.selectors.notesList);
    this.emptyStateElement = document.querySelector(this.selectors.emptyState);
    this.searchFormElement = document.querySelector(this.selectors.searchForm);
    this.searchInputElement = document.querySelector(this.selectors.searchInput);
    this.selectElement = document.querySelector(this.selectors.select);
    this.noteLabelElement = document.querySelector(this.selectors.noteLabel);
    this.checkboxElement = document.querySelector(this.selectors.checkbox);
    this.themeToggleButtonElement = document.querySelector(this.selectors.themeToggleButton);
    this.state = {
      notes: this.loadNotesFromStorage(),
      filteredNotes: null,
      currentSearchQuery: "",
      currentFilter: "ALL",
    };
    this.render();
    this.bindEvents();
  }

  loadNotesFromStorage() {
    const rawData = localStorage.getItem(this.localStorageKey);

    if (!rawData) {
      return [];
    }

    try {
      const savedNotes = JSON.parse(rawData);
      return Array.isArray(savedNotes) ? savedNotes : [];
    } catch {
      console.error("Error loading notes from storage");
      return [];
    }
  }

  saveNotesToStorage() {
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.state.notes)
    );
  }

  render() {
    const notes = this.state.filteredNotes ?? this.state.notes;

    this.notesListElement.innerHTML = notes
      .map(
        ({ id, title, isChecked }) => `
                <li class="notes__item" data-js-note>
                    <div class="note">
                        <div class="note__content">
                            <input id="${id}" type="checkbox" class="note__checkbox" data-js-note-checkbox ${
          isChecked ? "checked" : ""
        }>
                            <label for="${id}" class="note__label" data-js-note-label>${this.escapeHtml(
          title
        )}</label>
                        </div>
                        <div class="note__actions">
                            <button class="note__edit-button" type="button" aria-label="Edit" title="Edit" data-js-note-edit-button>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.67272 5.99106L2 12.6637V16H5.33636L12.0091 9.32736M8.67272 5.99106L11.0654 3.59837L11.0669 3.59695C11.3962 3.26759 11.5612 3.10261 11.7514 3.04082C11.9189 2.98639 12.0993 2.98639 12.2669 3.04082C12.4569 3.10257 12.6217 3.26735 12.9506 3.59625L14.4018 5.04738C14.7321 5.37769 14.8973 5.54292 14.9592 5.73337C15.0136 5.90088 15.0136 6.08133 14.9592 6.24885C14.8974 6.43916 14.7324 6.60414 14.4025 6.93398L14.4018 6.93468L12.0091 9.32736M8.67272 5.99106L12.0091 9.32736" stroke="#CDCDCD" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button class="note__delete-button" type="button" aria-label="Delete" title="Delete" data-js-note-delete-button>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z" stroke="#CDCDCD"/>
                                    <path d="M14.625 3.75H3.375" stroke="#CDCDCD" stroke-linecap="round"/>
                                    <path d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z" stroke="#CDCDCD"/>
                                    <path d="M10.5 9V12.75" stroke="#CDCDCD" stroke-linecap="round"/>
                                    <path d="M7.5 9V12.75" stroke="#CDCDCD" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </li>
        `
      )
      .join("");

    const isEmptyFilteredNotes = this.state.filteredNotes?.length === 0;
    const isEmptyNotes = this.state.notes.length === 0;

    if (isEmptyNotes || isEmptyFilteredNotes) {
      this.notesListElement.style.display = "none";
      this.emptyStateElement.style.display = "flex";
    } else {
      this.notesListElement.style.display = "block";
      this.emptyStateElement.style.display = "none";
    }
  }

  escapeHtml = (text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  openModal = () => {
    this.modalOverlayElement.classList.add("active");
    document.body.style.overflow = "hidden";
    this.noteInputElement.focus();
  };

  closeModal = () => {
    this.modalOverlayElement.classList.remove("active");
    document.body.style.overflow = "";
    this.noteFormElement.reset();
  };

  createNewNote(title) {
    this.state.notes.push({
      id: crypto?.randomUUID() ?? Date.now().toString(),
      title,
      isChecked: false,
    });
    this.saveNotesToStorage();
    this.applyFilters();
  }

  deleteNote(id) {
    this.state.notes = this.state.notes.filter((note) => note.id !== id);
    this.saveNotesToStorage();
    this.applyFilters();
  }

  toggleCheckedState(id) {
    this.state.notes = this.state.notes.map((note) => {
      if (note.id === id) {
        return {
          ...note,
          isChecked: !note.isChecked,
        };
      }

      return note;
    });

    this.saveNotesToStorage();
    this.applyFilters();
  }

  applyFilters() {
    let filteredNotes = this.state.notes;

    if (this.state.currentSearchQuery) {
      const formatedSearchQuery = this.state.currentSearchQuery.toLowerCase();
      filteredNotes = filteredNotes.filter(({ title }) => {
        return title.toLowerCase().includes(formatedSearchQuery);
      });
    }

    if (this.state.currentFilter !== "ALL") {
      filteredNotes = filteredNotes.filter(({ isChecked }) => {
        if (this.state.currentFilter === "Checked") {
          return isChecked;
        } else if (this.state.currentFilter === "Not checked") {
          return !isChecked;
        }
        return true;
      });
    }

    this.state.filteredNotes = filteredNotes.length > 0 ? filteredNotes : [];
    this.render();
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    const noteTitle = this.noteInputElement.value.trim();

    if (noteTitle) {
      this.createNewNote(noteTitle);
      this.closeModal();
    }
  };

  handleSearchFormSubmit = (event) => {
    event.preventDefault();
  };

  handleSearchInputChange = (event) => {
    const value = event.target.value.trim();
    this.state.currentSearchQuery = value;
    this.applyFilters();
  };

  handleSelectChange = (event) => {
    const value = event.target.value;
    this.state.currentFilter = value;
    this.applyFilters();
  };

  onClick = (event) => {
    if (event.target.matches(this.selectors.deleteButton)) {
      const noteElement = event.target.closest(this.selectors.note);
      const noteCheckboxElement = noteElement.querySelector(
        this.selectors.checkbox
      );
      this.deleteNote(noteCheckboxElement.id);
    }
  };

  onChange = (event) => {
    if (event.target.matches(this.selectors.checkbox)) {
      this.toggleCheckedState(event.target.id);
    }
  };

  onThemeToggleButtonClick = () => {
    document.body.classList.toggle("dark-theme");
  };

  bindEvents() {
    this.openModalButtonElement.addEventListener("click", this.openModal);
    this.closeModalButtonElement.addEventListener("click", this.closeModal);
    this.noteFormElement.addEventListener("submit", this.handleFormSubmit);
    this.searchFormElement.addEventListener("submit", this.handleSearchFormSubmit);
    this.searchInputElement.addEventListener("input", this.handleSearchInputChange);
    this.selectElement.addEventListener("change", this.handleSelectChange);
    this.notesListElement.addEventListener("click", this.onClick);
    this.notesListElement.addEventListener("change", this.onChange);
    this.themeToggleButtonElement.addEventListener("click", this.onThemeToggleButtonClick);
  }
}

new ToDoList();