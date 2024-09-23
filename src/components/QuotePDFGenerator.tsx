'use client'

import React from 'react'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Button } from "@/components/ui/button"
import { Download, Send } from 'lucide-react'

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10 },
  title: { fontSize: 24, marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 5 },
  text: { fontSize: 12, marginBottom: 5 },
})

const QuotePDF = ({ quote }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Smart Space Stair Storage Quote</Text>
        <Text style={styles.subtitle}>Customer Information</Text>
        <Text style={styles.text}>Name: {quote.customer_name}</Text>
        <Text style={styles.text}>Address: {quote.customer_address}</Text>
        <Text style={styles.text}>Email: {quote.customer_email}</Text>
        <Text style={styles.text}>Phone: {quote.customer_phone}</Text>
      </View>
      {/* Add other sections here, similar to the previous QuotePDF component */}
    </Page>
  </Document>
)

const QuotePDFGenerator = ({ quote, onSendEmail }) => {
  return (
    <div className="flex space-x-4">
      <PDFDownloadLink document={<QuotePDF quote={quote} />} fileName="quote.pdf">
        {({ blob, url, loading, error }) =>
          loading ? (
            <Button disabled>Loading document...</Button>
          ) : (
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          )
        }
      </PDFDownloadLink>
      <Button onClick={onSendEmail}>
        <Send className="mr-2 h-4 w-4" />
        Send Quote
      </Button>
    </div>
  )
}

export default QuotePDFGenerator