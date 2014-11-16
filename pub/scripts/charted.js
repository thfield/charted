/*global $, PageController, Utils */

$(function () {
  var $dataInput = $('.data-file-input')
  var pageController = new PageController()

  $('.load-data-form').submit(function (e) {
    e.preventDefault()

    var url = $dataInput.val()

    if (!url) {
      var emptyInputError = new Error('You’ll need to paste in the URL to a .csv file or Google Spreadhseet first.')
      pageController.errorNotify(emptyInputError)
    }

    $.get('/put', {url: url}, function (data) {
      pageController.setupPage({id: data.id, dataUrl: data.url})  
    }, 'json')
  })


  var id = window.location.pathname.slice(1)
  if (id) {
    $.get('/resolve', {id: id}, function (url) {
      pageController.setupPage({id: id, dataUrl: url})
    })
    return
  }

  var params = Utils.getUrlParameters()
  params.dataUrl = params.csvUrl || params.dataUrl // backwards-compatible support for csvUrl
  if (params.dataUrl) {
    pageController.setupPage(params)
  }
})
