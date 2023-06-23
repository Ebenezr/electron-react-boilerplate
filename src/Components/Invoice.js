import React, { useCallback, useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { jsPDF } from 'jspdf';
import { Document as PDFDocument, Page as PDFPage, pdfjs } from 'react-pdf';
import { format } from 'date-fns';
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';
import styles from '../index.css';
import 'jspdf-autotable';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PrintIcon from '@mui/icons-material/Print';
// Configure the worker source
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const KES = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'KES',
});

function Invoice({ payments }) {
  const [showPreview, setShowPreview] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [studentResponse, classResponse, termResponse, schoolResponse] =
        await Promise.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/students/all`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/classes/all`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/terms/all`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/schools/all`),
        ]);

      return {
        studentList: studentResponse?.data?.student,
        classList: classResponse?.data?.grade,
        termTypes: termResponse?.data?.term,
        school: schoolResponse?.data,
      };
    } catch (error) {
      throw new Error('Error fetching data');
    }
  };

  const { data: dataList, isLoading: loadingData } = useQuery(
    ['data'],
    fetchData
  );

  const studentList = dataList?.studentList;
  const classList = dataList?.classList;
  const termList = dataList?.termTypes;
  const schoolData = dataList?.school;

  const getStudentName = useCallback(
    (payments) => {
      if (studentList) {
        const student = studentList?.find(
          (student) => student.id === payments?.studentId
        );

        if (student) {
          const full_name = student.first_name + ' ' + student.last_name;
          return full_name;
        } else {
          return 'Student not found';
        }
      }
    },
    [studentList]
  );

  const getClassName = useCallback(
    (payments) => {
      if (classList) {
        const classname = classList?.find(
          (classname) => classname.id === payments?.classId
        );

        if (classname) {
          const name = classname.name;
          return name;
        } else {
          return 'Class not found';
        }
      }
    },
    [classList]
  );

  const getTermName = useCallback(
    (payments) => {
      if (termList) {
        const term = termList?.find(
          (classname) => term.id === payments?.termId
        );

        if (term) {
          const name = term.name;
          return name;
        } else {
          return 'Term not found';
        }
      }
    },
    [termList]
  );

  const date = new Date();
  const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const [
    { value: month },
    ,
    { value: day },
    ,
    { value: year },
    ,
    { value: hour },
    ,
    { value: minute },
    ,
    { value: second },
  ] = dateTimeFormat.formatToParts(date);

  // console.log('school', schoolData?.name);
  // console.log('student list', studentList);

  const generatePDF = useCallback(() => {
    if (payments && !loadingData) {
      try {
        const doc = new jsPDF();
        const title = schoolData?.name ?? 'SchoolSoft';
        // const companyName = schoolData?.school?.name ?? '';
        const companyAddress = schoolData?.address ?? '';
        const companyAddress2 = schoolData?.address2 ?? '';
        const companyPhone = schoolData?.phone ?? '';
        const companyPhone2 = schoolData?.phone2 ?? '';
        const companyEmail = schoolData?.email ?? '';
        const companyTown = schoolData?.town ?? '';
        const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize();

        // const balance = payments.balance || 0;
        // Add the company details and salutation to the PDF
        const date = new Date();
        const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false,
        });

        const [
          { value: month },
          ,
          { value: day },
          ,
          { value: year },
          ,
          { value: hour },
          ,
          { value: minute },
          ,
          { value: second },
        ] = dateTimeFormat.formatToParts(date);
        const invoiceGeneratedText = `${day} ${month} ${year} ${hour}:${minute}:${second}`;

        doc.setFontSize(18);
        doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, {
          align: 'center',
        });

        doc.setFontSize(12);
        doc.text(companyAddress, 20, 27);
        doc.text(companyAddress2, 20, 33);
        doc.text(companyTown, 20, 39);
        doc.text('Tel:', doc.internal.pageSize.getWidth() / 2 + 10, 27);
        doc.text(
          `${companyPhone} / ${companyPhone2}`,
          doc.internal.pageSize.getWidth() / 2 + 30,
          27
        );
        doc.text('Date:', doc.internal.pageSize.getWidth() / 2 + 10, 33);
        doc.text(
          invoiceGeneratedText,
          doc.internal.pageSize.getWidth() / 2 + 30,
          33
        );
        doc.text('Email:', doc.internal.pageSize.getWidth() / 2 + 10, 39);
        doc.text(companyEmail, doc.internal.pageSize.getWidth() / 2 + 30, 39);

        doc.setFontSize(12);

        const startY1 = doc.autoTable.previous.finalY + 35;
        const thankYouText =
          'Thank you for choosing us for your hotel booking!';
        const centerX = doc.internal.pageSize.getWidth() / 2;

        doc.text(thankYouText, centerX, startY1, {
          align: 'center',
        });

        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setShowPreview(true);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  }, [schoolData, payments, loadingData]);

  const printPDF = () => {
    if (!pdfUrl) return;

    const windowFeatures = 'width=800,height=600,scrollbars=yes,status=yes';
    const printWindow = window.open('', '_blank', windowFeatures);
    if (printWindow) {
      printWindow.document.write(
        '<html><head><title>Print PDF</title></head><body><iframe id="printFrame" src="' +
          pdfUrl +
          '" style="width:100%;height:100%;" frameborder="0" scrolling="no"></iframe></body></html>'
      );
      printWindow.document.close();
      printWindow.focus();

      // Wait for the PDF to load in the iframe, then print
      const printFrame = printWindow.document.getElementById('printFrame');
      if (printFrame) {
        printFrame.onload = () => {
          try {
            printWindow.print();
          } catch (error) {
            console.error('Error printing PDF:', error);
          }
        };
      } else {
        console.error('Error finding printFrame element');
      }
    } else {
      console.error('Error opening print window');
    }
  };

  useEffect(() => {
    generatePDF();
  }, [payments, generatePDF]);

  return (
    <>
      {payments && (
        <div className="bg-slate-50  py-2 px-4 flex items-center justify-between">
          <p className="text-gray-600 font-semibold text-lg">Invoice Preview</p>
          <Tooltip arrow title="Print">
            <IconButton onClick={printPDF}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {showPreview && pdfUrl ? (
        <div className="w-full h-[600px]">
          <PDFDocument
            file={pdfUrl}
            onLoadSuccess={() => setIsLoading(false)}
            onLoadError={(error) => {
              console.error('Error loading PDF:', error);
              setIsLoading(false);
            }}
            onRenderError={(error) =>
              console.error('Error rendering PDF:', error)
            }
            onLoadProgress={() => setIsLoading(true)}
          >
            <PDFPage pageNumber={1} />
          </PDFDocument>
          {loadingData && (
            <div className="flex justify-center items-center absolute inset-0">
              <div className={styles.spinner}></div>
            </div>
          )}
        </div>
      ) : (
        <p>No PDF to display</p>
      )}
    </>
  );
}

export default Invoice;
