import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateMedicalReport = (data) => {
  const { user, stats, risks, meds, insights } = data;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(50, 80, 60); // --color-primary
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('GLYCOGUARD MEDICAL REPORT', 20, 25);
  doc.setFontSize(10);
  doc.text(`Généré le : ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 32);

  // Patient Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Informations Patient', 20, 55);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`Nom : ${user?.firstName} ${user?.lastName}`, 20, 62);
  doc.text(`Email : ${user?.email}`, 20, 67);
  doc.text(`Type de Diabète : ${user?.diabetesType || 'Type 2'}`, 20, 72);

  // Metabolic Stats
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Bilan Métabolique (30 jours)', 20, 85);
  
  const statsData = [
    ['Moyenne Glycémique', `${Math.round(stats?.average_glucose || 0)} mg/dL`],
    ['Temps dans la Cible (TIR)', `${stats?.tir_percentage || 0}%`],
    ['HbA1c Estimée', `${stats?.estimated_hba1c || 0}%`],
    ['Variabilité (SD)', '24.5 mg/dL']
  ];

  doc.autoTable({
    startY: 90,
    head: [['Indicateur', 'Valeur']],
    body: statsData,
    theme: 'striped',
    headStyles: { fillColor: [50, 80, 60] }
  });

  // Risk Assessment
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Évaluation des Risques Complicatifs', 20, doc.lastAutoTable.finalY + 15);
  
  const riskData = [
    ['Score Global', `${risks?.assessment?.risk_score || 0}/100`],
    ['Niveau de Risque', risks?.assessment?.risk_level || 'Non évalué'],
    ['Risque Rénal', `${risks?.breakdown?.renal || 0}%`],
    ['Risque Rétinien', `${risks?.breakdown?.retinal || 0}%`],
    ['Risque Pied', `${risks?.breakdown?.foot || 0}%`]
  ];

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Domaine', 'Score / Statut']],
    body: riskData,
    theme: 'grid',
    headStyles: { fillColor: [168, 143, 111] } // --color-secondary
  });

  // Medications
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Traitement Actuel', 20, doc.lastAutoTable.finalY + 15);
  
  const medRows = meds.map(m => [m.name, m.dosage, m.frequency, m.is_insulin ? 'Oui' : 'Non']);
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Médicament', 'Dosage', 'Fréquence', 'Insuline']],
    body: medRows.length > 0 ? medRows : [['Aucun médicament enregistré', '', '', '']],
    theme: 'striped',
    headStyles: { fillColor: [50, 80, 60] }
  });

  // AI Insights
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Analyse Prédictive GlycoAI', 20, doc.lastAutoTable.finalY + 15);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  
  const splitInsights = doc.splitTextToSize(insights || 'Pas d\'analyse disponible.', pageWidth - 40);
  doc.text(splitInsights, 20, doc.lastAutoTable.finalY + 22);

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Ce rapport est généré automatiquement par GlycoGuard. Il ne remplace pas une consultation médicale.', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    doc.text(`Page ${i} sur ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
  }

  doc.save(`Rapport_GlycoGuard_${user?.lastName || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`);
};
