import React from 'react';
import jspdf from 'jspdf';



    Pdf = () => {
        jspdf.text('Hello World', 10, 10)
        jspdf.save('teste.pdf')
    }

export default Pdf();