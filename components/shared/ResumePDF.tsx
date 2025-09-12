// components/ResumePDF.tsx
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Font,
} from '@react-pdf/renderer';

interface ResumeEducation {
  school: string;
  degree: string;
  startYear: string;
  endYear: string;
}

interface ResumeExperience {
  company: string;
  jobTitle: string;
  startYear: string;
  endYear: string;
  achievements: string[];
}

interface ResumeData {
  fullName: string;
  role: string;
  summary: string;
  phone: string;
  email: string;
  linkedin: string;
  education: ResumeEducation;
  experience: ResumeExperience;
  skills: string;
}

Font.register({
  family: 'FontAwesome',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.ttf',
});

const ResumePDF = ({ data }: { data: ResumeData }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Helvetica',
      fontSize: 12,
    },
    header: {
      textAlign: 'center',
      paddingBottom: 15,
      borderBottomWidth: 2,
      borderBottomColor: '#E5E7EB',
      marginBottom: 20,
    },
    fullName: {
      fontSize: 28,
      fontWeight: 'extrabold',
      color: '#1F2937',
    },
    role: {
      fontSize: 18,
      color: '#4338CA',
      fontWeight: 'semibold',
      marginTop: 5,
    },
    contactInfo: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
      gap: 15,
      flexWrap: 'wrap',
    },
    contactText: {
      color: '#4B5563',
    },
    icon: {
      fontFamily: 'FontAwesome',
      fontSize: 10, // Adjust icon size
      marginRight: 4,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1F2937',
      borderBottomWidth: 2,
      borderBottomColor: '#6366F1',
      paddingBottom: 4,
      marginBottom: 10,
    },
    sectionTitleIcon: {
      fontFamily: 'FontAwesome',
      fontSize: 12,
      marginRight: 8,
    },
    sectionText: {
      color: '#374151',
    },
    educationDegree: {
      fontSize: 14,
      fontWeight: 'semibold',
      color: '#1F2937',
    },
    educationSchool: {
      color: '#4B5563',
      fontStyle: 'italic',
      marginTop: 2,
    },
    educationDates: {
      color: '#6B7280',
      fontSize: 10,
      marginTop: 2,
    },
    experienceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    experienceTitle: {
      fontSize: 14,
      fontWeight: 'semibold',
      color: '#1F2937',
    },
    experienceDates: {
      color: '#6B7280',
      fontSize: 10,
    },
    experienceCompany: {
      color: '#4B5563',
      fontStyle: 'italic',
      marginBottom: 5,
    },
    bulletList: {
      marginTop: 5,
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: 3,
    },
    bullet: {
      marginRight: 5,
      fontSize: 8,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 5,
      marginTop: 10,
    },
    skillTag: {
      backgroundColor: '#E0E7FF',
      color: '#4338CA',
      fontSize: 10,
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: 9999,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ flexGrow: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.fullName}>{data.fullName}</Text>
            <Text style={styles.role}>{data.role}</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>
                <Text style={styles.icon}>&#xf095; </Text> {/* Phone icon */}
                {data.phone}
              </Text>
              <Text style={styles.contactText}>
                <Text style={styles.icon}>&#xf0e0; </Text> {/* Mail icon */}
                {data.email}
              </Text>
              <Link src={`https://${data.linkedin}`} style={styles.contactText}>
                <Text style={styles.icon}>&#xf08e; </Text> {/* External link icon */}
                LinkedIn
              </Link>
            </View>
          </View>

          {/* Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.sectionText}>{data.summary}</Text>
          </View>

          {/* Education */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.sectionTitleIcon}>&#xf19d;</Text> {/* Graduation cap icon */}
              <Text style={styles.sectionTitle}>Education</Text>
            </View>
            <View>
              <Text style={styles.educationDegree}>{data.education.degree}</Text>
              <Text style={styles.educationSchool}>{data.education.school}</Text>
              <Text style={styles.educationDates}>
                {data.education.startYear} - {data.education.endYear}
              </Text>
            </View>
          </View>

          {/* Experience */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.sectionTitleIcon}>&#xf0b1;</Text> {/* Briefcase icon */}
              <Text style={styles.sectionTitle}>Experience</Text>
            </View>
            <View>
              <View style={styles.experienceHeader}>
                <Text style={styles.experienceTitle}>
                  {data.experience.jobTitle}
                </Text>
                <Text style={styles.experienceDates}>
                  {data.experience.startYear} - {data.experience.endYear}
                </Text>
              </View>
              <Text style={styles.experienceCompany}>
                {data.experience.company}
              </Text>
              <View style={styles.bulletList}>
                {data.experience.achievements.map((achievement, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text>{achievement}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Skills */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {data.skills.split(',').map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text>{skill.trim()}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ResumePDF;