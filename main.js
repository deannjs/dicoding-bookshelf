const $form = document.getElementById('inputBook')
const $bookSubmitText = document.getElementById('bookSubmitText')
const $searchBook = document.getElementById('searchBook')
$inputBookIsComplete = document.getElementById('isCompleted')
const $completeBookshelfList = document.getElementById('completeBookshelfList')
const $incompleteBookshelfList = document.getElementById('incompleteBookshelfList')

let books = JSON.parse(localStorage.getItem('books')) || []
let bookSearchResult = []

$inputBookIsComplete.onchange = e => $bookSubmitText.innerText = $inputBookIsComplete.checked ? 'Sudah selesai dibaca' : 'Belum selesai dibaca'

const saveToLocalStorage = () => {
    localStorage.setItem('books', JSON.stringify(books))
}

const render = (isRenderSearch) => {
    // Save Latest Data
    saveToLocalStorage()

    const bookUsed = isRenderSearch ? bookSearchResult : books

    // Delete Current Data
    $completeBookshelfList.innerHTML = ''
    $incompleteBookshelfList.innerHTML = ''

    let completeBooksHtml = ''
    let incompleteBooksHtml = ''

    bookUsed.forEach(book => {
        const bookElement = `
        <article class="book_item" id="${book.id}">
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
    
            <div class="action">
                <button class="green" onclick="switchCompleted(${book.id})">Selesai dibaca</button>
                <button class="red" onclick="deleteBook(${book.id})">Hapus buku</button>
            </div>
      </article> `
        if (book.isCompleted) completeBooksHtml += bookElement
        else incompleteBooksHtml += bookElement
    })

    $completeBookshelfList.innerHTML = completeBooksHtml
    $incompleteBookshelfList.innerHTML = incompleteBooksHtml
}

const switchCompleted = id => {
    books = books.map(book => {
        if (book.id === id) return { ...book, isCompleted: !book.isCompleted }
        else return book
    })
    render()
}

const deleteBook = (id) => {
    books = books.filter(book => book.id !== id)
    render()
}

const createBook = ({ title, author, year, isCompleted }) => {
    books.push({
        id: +new Date(),
        title,
        author,
        year,
        isCompleted
    })

    render()
}

$form.onsubmit = e => {
    e.preventDefault()

    createBook({
        title: e.target.title.value,
        author: e.target.author.value,
        year: e.target.year.value,
        isCompleted: e.target.isCompleted.checked
    })

    e.target.reset()
}

$searchBook.onsubmit = e => {
    e.preventDefault()

    if (e.target.title.value) {
        const regex = new RegExp(e.target.title.value)
        bookSearchResult = books.filter(book => regex.test(book.title))
        render(true)
    } else render()
}

render()