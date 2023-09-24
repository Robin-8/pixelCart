const variationSelection = document.querySelectorAll('.sp-variations-selection .sp-variation');
const finishSelection = document.querySelector('.sp-finish-selection').querySelectorAll('.sp-variation');

variationSelection.forEach((variationButton) => {
    variationButton.addEventListener('click', function(e) {
        e.preventDefault()

        variationButton.parentNode.querySelectorAll('.sp-variation').forEach(sibling => {
            sibling.classList.remove('sp-selected')
        })
        variationButton.classList.add('sp-selected')
    });
})

finishSelection.forEach((variationButton) => {
    variationButton.addEventListener('click', function(e) {
        e.preventDefault();

        const currentPicture = variationButton.getAttribute('href');
        document.querySelectorAll('.sp-product-image').forEach(productImage => {
            productImage.classList.remove('sp-show')
        });

        document.getElementById(currentPicture).classList.add('sp-show');
        console.log(currentPicture)
    });
})