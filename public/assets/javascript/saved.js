// global bootbox
$(document).ready(function () {
  // Getting a reference to the article container div to render all articles inside of
  var articleContainer = $(".article-container");
  //Adding event listeners for dynamically generated buttons for deleting articles, pulling up article notes, saving article notes, and deleting article notes
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleArticleNoteSave);
  $(document).on("click", ".btn.note-delete", handleArticleNoteDelete);

  // initPage initiates everything when the page is loaded
  initPage();

  function initPage() {
    // Empty article container, run an AJAX request for any saved headlines
    articleContainer.empty();
    $.get("/api/headlines?saved=true").then(function (data) {
      // If there are headlines, render them to the page
      if (data && data.length) {
        renderArticles(data);
      } else {
        // Otherwise render a message explaining no articles
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    //This function handles appending HTML containing our article data to the page
    // A JSON array is passed containing all available articles in database
    var articlePanels = [];
    //Each article JSON object is passed to the createPanel function which returns a bootstrap panel with the article data inside
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articlePanels array, append them to the articlePanels container
    articleContainer.append(articlePanels);
  }

  function createPanel(article) {
    // This function takes in a single JSON object for an article/headline, it constructs a jQuery element containing all the formatted HTML for the article panel
    var panel =
      $(["<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        article.headline,
        "<a class='btn btn-danger delete'>",
        "Delete From Saved",
        "</a>",
        "<a class='btn btn-info notes'>Article Notes</a>",
        "</h3>",
        "<div class='panel-heading'>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>",
      ].join(""));
    // Attach the article's id to the jQuery element
    // Use this when trying to figure out which article the user wants to remove or open notes for
    panel.data("_id", article._id);
    return panel;
  }

  function renderEmpty() {
    // This function renders some HTML to the page explaining there are no articles to view.
    //Using a joined array of HTML string data because it is easier to read/change than a concatenated string
    var emptyAlert =
      $(["<div class='alert alert-warning text-center'>",
        "<h4>Oh No!! Looks like there are no saved articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>Would you like to browse available articles?</h3>",
        "</div>",
        "</div>"
      ].join(""));
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {
    // This function handles rendering note list items to notes modal
    // Setting up an array of notes to render after finished
    // Also setting up a currentNote variable to temporarily store each note
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      //if there are no notes, just display a message explaining this
      currentNote = [
        "<li class='list-group-item'>",
        "No notes for this article yet.",
        "</li>"
      ].join("");
      notesToRender.push(currentNote);
    } else {
      // if there are notes, go through each one
      for (var i = 0; i < data.notes.length; i++) {
        // Constructs an li element to contain the noteText and a delete button
        currentNote = $([
          "<li class='list-group-item note'>",
          data.notes[i].noteText,
          "<button class='btn btn-danger note-delete'>x</button>",
          "</li>"
        ].join(""));
        // store the note id on the delete button for easy access when trying to delete
        currentNote.children("button").data("_id", data.notes[i]._id);
        // adding currentNote to the notesToRender array
        notesToRender.push(currentNote);
      }
    }
    // Append the notesToRender to the note-container inside the note modal
    $(".note-container").append(notesToRender);
  }

  function handleArticleDelete() {
    // this function handles deleting articles/headlines
    // grab the id of the article to delet from the panel element the delete button sits aside
    var articleToDelete = $(this).parents(".panel").data();
    // Using a delet method here to be semantic since deleting an article/headline
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function (data) {
      //If this works, run initPage again which will render the list of saved articles
      if (data.ok) {
        initPage();
      }
    });
  }

  function handleArticleNotes() {
    // This function handles appending the notes modal and displaying the notes
    // grab the id of the article to ge notes from the panel element the delet button sits inside
    var currentArticle = $(this).parents(".panel").data();
    // grab any notes with the headline/article id
    $.get("/api/notes/" + currentArticle._id).then(function (data) {
      //constructing the initial html to add to the notes modal
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes for Article: ",
        currentArticle._id,
        "</h4>",
        "<hr />",
        "<ul class='list-group notes-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows = '4' cols = '60'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>"
      ].join("");
      // Adding the formatting HTML to the note modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      // Adding some information about the article notes to the save button for easy access when trying to add a new note
      $(".btn.save").data("article", noteData);
      // renderNotesList will populate the actual note HTML inside the modal created/opened
      renderNotesList(noteData);
    });
  }

  function handleArticleNoteSave() {
    // this function handles what happens when a user tries to save anew note for an article 
    // setting a variable to hld some formatted data about the note, grabbing the note typed into the input box
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();
    //If there is data typed into the note input field, format it and post it to the "/api/notes" route and send the formatted noteData as well
    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        noteText: newNote
      };
      $.post("/api/notes", noteData).then(function () {
        //when complete, close the modal
        bootbox.hideAll();
      });
    }
  }

  function handleArticleNoteDelete() {
    // this function handles the deletion of notes
    // first grab the id of the note to delete that was stored on the delete button when it was created
    var noteToDelete = $(this).data("_id");
    // perform a DELETE request to "/api/notes/" with the id of the note being deleted as a parameter
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function () {
      // When done, hide the modal
      bootbox.hideAll();
    });
  }
});