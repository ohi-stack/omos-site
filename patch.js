  function exportPdf() {
    if (!currentRecord) return showError('Run OMOS or open a Decision Record before exporting.');
    const element = document.getElementById('results');
    const opt = {
      margin: 0.5,
      filename: `${currentRecord.requestId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  }
