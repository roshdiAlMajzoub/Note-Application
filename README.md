# Note-Application

API created:
* Authentication: 
  * signup : whcih has 4 inputs that get them from body, name, email , password, and confirmPassword;
  *login: whcich has 2 inputs that get them from body, email and password
  
 
* Authorazation: 
  *isAuth: is a middle ware that check whether a user is authenticated and authorized.
  

* categories apis:
  * getCategories: http://localhost:8080/categories/all-categories
  * createCategory:  http://localhost:8080/categories/category  which takes 1 input from body (name)
  *getCategory:  http://localhost:8080/categories/category/:categId  which fetch the specified category
  *updateCategory :  http://localhost:8080/categories/category/:categId which update  a specified category it takes name input from body
  *deleteCategory:   http://localhost:8080/categories/category/:categId which deleets a specified category
 
 
* notes apis:
  *getNotes:  http://localhost:8080/notes/all-notes which fetch for the user his notes
  *createNote:  http://localhost:8080/notes/note which takes 4 inputs from the body. content, categoryName, categoryId, and tags as array
  *getNote:  http://localhost:8080/notes/note which fetch a specified note for the user
  *updateNote :  http://localhost:8080/notes/note/:noteId which updates the content and tags of a note that get them from body and the note id from params
  deleteNote:  http://localhost:8080/notes/note/:noteId which deletes a specified note
 
when creating a note the tags will be either created if they are not in the db.

*search apis:
  *viewNoteAccToCategory : http://localhost:8080/search/byCategory/:categId which fetch the notes for a specific category
  *searchByTags : http://localhost:8080/search/byTag/:tag which fetch the notes for a specific tag.
  *filterBycategoryAndCategory: http://localhost:8080/search/byTagCategory/:tags  is an api that fetch for the user the specified nte for a specific tags filtered by categories and sorted by updatedAt
