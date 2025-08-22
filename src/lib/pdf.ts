import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function pdfFromEl(el: HTMLElement, filename='vistoria.pdf') {
  const canvas = await html2canvas(el, { scale: 2 })
  const img = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p','pt','a4')
  const w = pdf.internal.pageSize.getWidth(), r = w/canvas.width
  pdf.addImage(img,'PNG',0,0,canvas.width*r,canvas.height*r)
  pdf.save(filename)
}