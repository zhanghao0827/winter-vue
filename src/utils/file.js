export function downloadFile(obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  const filename = name + uuid() + '.' + suffix
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function uuid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }

  return (S4() + S4() + '-' + S4() + S4() + '-' + S4() + S4())
}
