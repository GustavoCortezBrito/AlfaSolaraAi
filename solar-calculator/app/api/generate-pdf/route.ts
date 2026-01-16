import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const data: PDFData = await request.json();
    const { calculation } = data;

    // Criar PDF em formato A4
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = margin;

    // Cores Alfa (azul/cyan/prata)
    const colors = {
      primary: [59, 130, 246] as [number, number, number],      // Azul #3b82f6
      secondary: [34, 211, 238] as [number, number, number],    // Cyan #22d3ee
      accent: [156, 163, 175] as [number, number, number],      // Cinza #9ca3af
      dark: [15, 23, 42] as [number, number, number],           // Slate-900
      light: [241, 245, 249] as [number, number, number],       // Slate-100
      white: [255, 255, 255] as [number, number, number],
      success: [34, 197, 94] as [number, number, number],       // Verde
      warning: [251, 146, 60] as [number, number, number]       // Laranja
    };

    // ==================== CABEÇALHO ====================
    
    // Fundo azul no topo
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Logo Alfa (texto estilizado)
    doc.setTextColor(...colors.white);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('ALFA', margin, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(...colors.secondary);
    doc.text('SOLAR', margin, 28);

    // Linha decorativa
    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(2);
    doc.line(margin, 32, margin + 30, 32);

    // Título do documento
    doc.setTextColor(...colors.white);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PROPOSTA COMERCIAL', pageWidth - margin, 20, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema Fotovoltaico', pageWidth - margin, 27, { align: 'right' });
    doc.text(`Data: ${data.dataGeracao}`, pageWidth - margin, 32, { align: 'right' });

    yPos = 55;

    // ==================== DADOS DO CLIENTE ====================
    
    doc.setFillColor(...colors.light);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, 'F');

    doc.setTextColor(...colors.dark);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO CLIENTE', margin + 5, yPos + 7);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Localização: ${data.cidade}, ${data.estado}`, margin + 5, yPos + 14);
    doc.text(`CEP: ${data.cep}`, margin + 5, yPos + 20);
    doc.text(`Consumo Atual: ${data.consumoMedioMensal} kWh/mês`, pageWidth / 2, yPos + 14);
    
    if (data.pretendAumentar && data.equipamentosAdicionais && data.equipamentosAdicionais.length > 0) {
      const consumoAdicional = data.equipamentosAdicionais.reduce((acc, eq) => 
        acc + (eq.potenciaWatts * eq.horasUsoDia * 30 * eq.quantidade) / 1000, 0);
      doc.text(`Expansão Planejada: +${consumoAdicional.toFixed(0)} kWh/mês`, pageWidth / 2, yPos + 20);
    }

    yPos += 35;

    // ==================== RESUMO DO SISTEMA ====================
    
    doc.setFillColor(...colors.primary);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
    
    doc.setTextColor(...colors.white);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DIMENSIONAMENTO DO SISTEMA', margin + 5, yPos + 7);

    yPos += 15;

    // Cards de informação
    const cardWidth = (pageWidth - 2 * margin - 10) / 2;
    const cardHeight = 22;

    // Card 1: Potência (usar potência real instalada)
    const potenciaInstalada = (calculation.quantidade_placas * calculation.placa_watts) / 1000;
    doc.setFillColor(...colors.secondary);
    doc.roundedRect(margin, yPos, cardWidth, cardHeight, 2, 2, 'F');
    doc.setTextColor(...colors.dark);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Potência Instalada', margin + 5, yPos + 7);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${potenciaInstalada.toFixed(2)} kWp`, margin + 5, yPos + 16);

    // Card 2: Placas
    doc.setFillColor(...colors.secondary);
    doc.roundedRect(margin + cardWidth + 5, yPos, cardWidth, cardHeight, 2, 2, 'F');
    doc.setTextColor(...colors.dark);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Módulos Fotovoltaicos', margin + cardWidth + 10, yPos + 7);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${calculation.quantidade_placas}x ${calculation.placa_watts}W`, margin + cardWidth + 10, yPos + 16);

    yPos += cardHeight + 5;

    // Card 3: Investimento
    doc.setFillColor(...colors.success);
    doc.roundedRect(margin, yPos, cardWidth, cardHeight, 2, 2, 'F');
    doc.setTextColor(...colors.white);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Investimento Total', margin + 5, yPos + 7);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`R$ ${calculation.custo_estimado.toLocaleString('pt-BR')}`, margin + 5, yPos + 16);

    // Card 4: Payback
    doc.setFillColor(...colors.warning);
    doc.roundedRect(margin + cardWidth + 5, yPos, cardWidth, cardHeight, 2, 2, 'F');
    doc.setTextColor(...colors.white);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Retorno do Investimento', margin + cardWidth + 10, yPos + 7);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${calculation.payback_anos.toFixed(1)} anos`, margin + cardWidth + 10, yPos + 16);

    yPos += cardHeight + 10;

    // ==================== ESPECIFICAÇÕES TÉCNICAS ====================
    
    doc.setFillColor(...colors.primary);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
    
    doc.setTextColor(...colors.white);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ESPECIFICAÇÕES TÉCNICAS', margin + 5, yPos + 7);

    yPos += 15;

    // Calcular produção mensal real
    const potenciaReal = (calculation.quantidade_placas * calculation.placa_watts) / 1000;
    const producaoMensalReal = Math.round(potenciaReal * calculation.irradiacao_media * 30 * 0.80);
    
    // Tabela de especificações
    autoTable(doc, {
      startY: yPos,
      head: [['Item', 'Especificação']],
      body: [
        ['Potência Mínima Calculada', `${calculation.potencia_kwp.toFixed(2)} kWp`],
        ['Potência Instalada', `${potenciaReal.toFixed(2)} kWp`],
        ['Módulos Fotovoltaicos', `${calculation.quantidade_placas} unidades de ${calculation.placa_watts}W`],
        ['Inversor', calculation.inversor],
        ['Irradiação Solar Média (HSP)', `${calculation.irradiacao_media.toFixed(2)} kWh/m²/dia`],
        ['Produção Mensal Estimada', `${producaoMensalReal} kWh/mês`],
        ['Consumo Total', `${calculation.consumo_total_kwh.toFixed(0)} kWh/mês`],
        ['Eficiência do Sistema', '80% (considerando perdas)'],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.white,
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: colors.dark
      },
      alternateRowStyles: {
        fillColor: colors.light
      },
      margin: { left: margin, right: margin }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // ==================== ANÁLISE TÉCNICA ====================
    
    // Verificar se precisa de nova página
    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFillColor(...colors.primary);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
    
    doc.setTextColor(...colors.white);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ANÁLISE TÉCNICA', margin + 5, yPos + 7);

    yPos += 15;

    // Adicionar nota sobre dimensionamento
    doc.setFillColor(...colors.light);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 18, 2, 2, 'F');
    
    doc.setTextColor(...colors.dark);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('💡 Sobre o Dimensionamento:', margin + 5, yPos + 6);
    
    doc.setFont('helvetica', 'normal');
    const notaDimensionamento = doc.splitTextToSize(
      `O sistema foi dimensionado para produzir ligeiramente acima do consumo atual. Isso compensa perdas sazonais (dias nublados, chuva) e garante a compensação integral do consumo ao longo do ano. O excedente gera créditos de energia válidos por 60 meses.`,
      pageWidth - 2 * margin - 10
    );
    doc.text(notaDimensionamento, margin + 5, yPos + 11);
    
    yPos += 23;

    // Texto da explicação com quebra de linha
    doc.setTextColor(...colors.dark);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    const explicacaoLines = doc.splitTextToSize(
      calculation.explicacao, 
      pageWidth - 2 * margin - 10
    );
    
    doc.text(explicacaoLines, margin + 5, yPos);
    yPos += explicacaoLines.length * 4 + 10;

    // ==================== EQUIPAMENTOS ADICIONAIS ====================
    
    if (data.pretendAumentar && data.equipamentosAdicionais && data.equipamentosAdicionais.length > 0) {
      // Verificar se precisa de nova página
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFillColor(...colors.primary);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
      
      doc.setTextColor(...colors.white);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('EQUIPAMENTOS PLANEJADOS', margin + 5, yPos + 7);

      yPos += 15;

      const equipamentosData = data.equipamentosAdicionais.map(eq => {
        const consumoMensal = (eq.potenciaWatts * eq.horasUsoDia * 30 * eq.quantidade) / 1000;
        return [
          eq.nome,
          `${eq.potenciaWatts}W`,
          eq.quantidade.toString(),
          `${eq.horasUsoDia}h/dia`,
          `${consumoMensal.toFixed(0)} kWh/mês`
        ];
      });

      autoTable(doc, {
        startY: yPos,
        head: [['Equipamento', 'Potência', 'Qtd', 'Uso Diário', 'Consumo Mensal']],
        body: equipamentosData,
        theme: 'grid',
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.white,
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: colors.dark
        },
        alternateRowStyles: {
          fillColor: colors.light
        },
        margin: { left: margin, right: margin }
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // ==================== RODAPÉ ====================
    
    const addFooter = (pageNum: number) => {
      const footerY = pageHeight - 25;
      
      // Linha decorativa
      doc.setDrawColor(...colors.secondary);
      doc.setLineWidth(0.5);
      doc.line(margin, footerY, pageWidth - margin, footerY);
      
      // Informações da empresa
      doc.setTextColor(...colors.accent);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Alfa Solar - Energia Renovável', margin, footerY + 5);
      doc.text('Presidente Prudente/SP', margin, footerY + 9);
      doc.text(`Página ${pageNum}`, pageWidth - margin, footerY + 7, { align: 'right' });
      
      // Powered by
      doc.setFontSize(7);
      doc.setTextColor(...colors.accent);
      doc.text('Powered by Groq AI • Cálculos precisos baseados em dados reais', pageWidth / 2, footerY + 13, { align: 'center' });
      
      // Copyright
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text('© 2026 Alfa Esquadrias - Todos os direitos reservados', pageWidth / 2, footerY + 17, { align: 'center' });
    };

    // Adicionar rodapé em todas as páginas
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(i);
    }

    // Gerar PDF como buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Proposta-Alfa-Solar-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar PDF' },
      { status: 500 }
    );
  }
}
