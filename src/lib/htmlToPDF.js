// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import print from 'print-js'
export function createPdf(data){
  // install (Vue, options) {
  //   Vue.prototype.getPdf = function (data) {
        //var title = this.htmlTitle
        var title = data.title;
        var c = document.createElement("canvas")
        var opts = {
            scale: 2, 
            canvas: c, 
            logging: true,
            allowTaint: true,
            width: data.bdhtml.offsetWidth,
            height: data.bdhtml.offsetHeight
          };
        c.width = data.bdhtml.offsetWidth * 4
        c.height = data.bdhtml.offsetHeight * 4
        c.getContext("2d").scale(2, 2);
        html2Canvas(data.bdhtml, opts).then(function (canvas) {
            let contentWidth = canvas.width
            let contentHeight = canvas.height
            let pageHeight = contentWidth / 592.28 * 841.89
            let leftHeight = contentHeight
            let position = 0
            let imgWidth = 595.28
            let imgHeight = 592.28 / contentWidth * contentHeight
            let pageData = canvas.toDataURL('image/jpeg', 1.0)
            let PDF = new JsPDF('', 'pt', 'a4')
            if (leftHeight < pageHeight) {
              PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
            } else {
              while (leftHeight > 0) {
                PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                leftHeight -= pageHeight
                position -= 841.89
                if (leftHeight > 0) {
                  PDF.addPage()
                }
              }
            }
        PDF.save(title + '.pdf')
      }
      )
}
/**
 * @description: 
 * @param {type} 
 * @return: 
 */
export function createImgToPrint(data){
  html2Canvas(
    data.bdhtml,
    {
      backgroundColor: '#ffffff' // null 表示设置背景为透明色
    }
  ).then(canvas => {
    const imgUrl = canvas.toDataURL("image/jpeg");
    printJS({
      printable: imgUrl,
      type: 'image'})
    // img.src = imgUrl;
    // // 创建隐藏的可下载链接
    // var eleLink = document.createElement("a");
    // eleLink.href = imgUrl; // 转换后的图片地址
    // eleLink.download = "pictureName";
    // // 触发点击
    // document.body.appendChild(eleLink);
    // eleLink.click();
    // // 然后移除
    // document.body.removeChild(eleLink);
  });
}
//   }
// }