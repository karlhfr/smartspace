import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10 },
  title: { fontSize: 24, marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 5 },
  text: { fontSize: 12, marginBottom: 5 },
})

interface QuotePDFProps {
  quote: {
    customer_name: string
    customer_address: string
    customer_email: string
    customer_phone: string
    stair_width: string
    height_of_4_steps: string
    length_of_4_steps: string
    tread_depth: string
    riser_height: string
    color_option: string
    drawer_option: string
    handle_size: string
    handle_color: string
    install_price: string
    total_price: string
    additional_notes: string
  }
}

const QuotePDF: React.FC<QuotePDFProps> = ({ quote }) => (
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
      <View style={styles.section}>
        <Text style={styles.subtitle}>Stair Measurements</Text>
        <Text style={styles.text}>Stair Width: {quote.stair_width} mm</Text>
        <Text style={styles.text}>Height of 4 Steps: {quote.height_of_4_steps} mm</Text>
        <Text style={styles.text}>Length of 4 Steps: {quote.length_of_4_steps} mm</Text>
        <Text style={styles.text}>Tread Depth: {quote.tread_depth} mm</Text>
        <Text style={styles.text}>Riser Height: {quote.riser_height} mm</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Product Options</Text>
        <Text style={styles.text}>Color Option: {quote.color_option}</Text>
        <Text style={styles.text}>Drawer Option: {quote.drawer_option}</Text>
        <Text style={styles.text}>Handle Size: {quote.handle_size}</Text>
        <Text style={styles.text}>Handle Color: {quote.handle_color}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Pricing</Text>
        <Text style={styles.text}>Installation Price: £{quote.install_price}</Text>
        <Text style={styles.text}>Total Price: £{quote.total_price}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Additional Notes</Text>
        <Text style={styles.text}>{quote.additional_notes}</Text>
      </View>
    </Page>
  </Document>
)

export default QuotePDF