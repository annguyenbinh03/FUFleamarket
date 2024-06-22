// document.querySelector('.dropdown').addEventListener('mouseenter', function() {
//     this.querySelector('.dropdown-toggle').click();
//   });

//   document.querySelector('.dropdown').addEventListener('mouseleave', function() {
//     var dropdownToggle = this.querySelector('.dropdown-toggle');
//     setTimeout(function() {
//         dropdownToggle.click();
//     }, 1000); // 0.5 giây
// });


window.addEventListener('load', function () {
    var loader = document.querySelector('.loader');
    var preloder = document.querySelector('#preloder');

    if (loader) {
        loader.style.display = 'none';
    }

    if (preloder) {
        setTimeout(function () {
            preloder.style.display = 'none';
        }, 200);
    }
});

////Chat

