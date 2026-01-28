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
    const margin = 20;
    let yPos = margin;

    // Cores Alfa Solar (amarelo/âmbar/dourado)
    const colors = {
      primary: [245, 158, 11] as [number, number, number],        // Amber-500 #f59e0b
      secondary: [252, 211, 77] as [number, number, number],      // Amber-300 #fcd34d
      accent: [251, 191, 36] as [number, number, number],         // Amber-400 #fbbf24
      dark: [15, 23, 42] as [number, number, number],             // Slate-900
      light: [255, 251, 235] as [number, number, number],         // Amber-50 #fffbeb
      white: [255, 255, 255] as [number, number, number],
      success: [34, 197, 94] as [number, number, number],         // Green-500
      text: [71, 85, 105] as [number, number, number],            // Slate-600
      textLight: [148, 163, 184] as [number, number, number]      // Slate-400
    };

    // ==================== CABEÇALHO ALFA SOLAR ====================
    
    // Fundo amarelo no topo
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Logo Alfa Solar
    doc.setTextColor(...colors.white);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('ALFA SOLAR', margin, 18);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Energia Solar Fotovoltaica', margin, 26);
    doc.text('Presidente Prudente/SP', margin, 32);

    // Título do documento
    doc.setTextColor(...colors.white);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PROPOSTA COMERCIAL', pageWidth - margin, 16, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Orçamento Nº: WEB-${Date.now().toString().slice(-8)}`, pageWidth - margin, 24, { align: 'right' });
    doc.text(`Data: ${data.dataGeracao}`, pageWidth - margin, 30, { align: 'right' });

    yPos = 50;

    // ==================== EQUIPAMENTOS UTILIZADOS ====================
    
    doc.setTextColor(...colors.dark);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('- Equipamentos Utilizados:', margin, yPos);

    yPos += 10;

    // Calcular dados do sistema
    const potenciaInstalada = (calculation.quantidade_placas * calculation.placa_watts) / 1000;
    const modeloModulo = `${calculation.placa_watts}W`;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.text);
    
    const equipamentos = [
      `1- Inversor Solar ${calculation.inversor}`,
      `2- ${calculation.quantidade_placas} módulos ${modeloModulo}`,
      `3- STRING BOX (Proteção)`,
      `4- Trilhos Suportes fixação em alumínio.`,
      `5- Conectores e cabeamento necessário para o projeto.`
    ];

    equipamentos.forEach((item, index) => {
      doc.text(item, margin, yPos + (index * 6));
    });

    yPos += equipamentos.length * 6 + 10;

    // ==================== ITENS INCLUSOS NA PROPOSTA ====================
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.dark);
    doc.text('- Itens inclusos na proposta:', margin, yPos);

    yPos += 10;

    const itensInclusos = [
      '1 - Dimensionamento do projeto de acordo com condições geográficas físicas e média de',
      '    consumo do cliente',
      '2 – Elaborações de todo projeto de engenharia elétrica',
      '3 – Autorização e homologação junto à concessionária para conexão à rede',
      '4 – Cabeamento elétrico fotovoltaico CC incluso na instalação entre módulos e inversores de',
      '    frequência.',
      '5 – String Box (Sistema de Proteção).',
      '7 – Sistema de monitoramento via aplicativo'
    ];

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.text);

    itensInclusos.forEach((item, index) => {
      doc.text(item, margin, yPos + (index * 5));
    });

    yPos += itensInclusos.length * 5 + 10;

    // ==================== ITENS NÃO INCLUSOS ====================
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.dark);
    doc.text('- Itens não inclusos na proposta:', margin, yPos);

    yPos += 10;

    const itensNaoInclusos = [
      '1 – Reforço em estruturas de telhado e adaptações afins',
      '2 – Adequações do padrão de entrada do cliente',
      '3 – Adequações em sistema de medidor'
    ];

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.text);

    itensNaoInclusos.forEach((item, index) => {
      doc.text(item, margin, yPos + (index * 6));
    });

    yPos += itensNaoInclusos.length * 6 + 10;

    // ==================== PRAZO DE EXECUÇÃO ====================
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.dark);
    doc.text('- Prazo de execução do serviço:', margin, yPos);

    yPos += 10;

    const textoPrazo = doc.splitTextToSize(
      'O prazo de entrega dos serviços leva em consideração a elaboração e o tempo para aprovação do cliente sendo 30 dias. A aprovação do projeto, inspeção e liberação da concessionária mais 30 dias, levando todas as obrigações em consideração o prazo médio para liberação de uso e geração de energia é de até 60 dias. (média de homologação 40 dias).',
      pageWidth - 2 * margin
    );

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.text);
    doc.text(textoPrazo, margin, yPos);

    yPos += textoPrazo.length * 5 + 10;

    // ==================== GARANTIAS ====================
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.dark);
    doc.text('- Garantias:', margin, yPos);

    yPos += 10;

    const garantias = [
      '1 – Instalação 3 anos',
      '2 – Placas 25 anos 80% Eficiência – 12 anos fábrica',
      '3 – Inversores 10 anos',
      '4 – String Box 5 anos',
      '5 – Estrutura em alumínio 25 anos'
    ];

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.text);

    garantias.forEach((item, index) => {
      doc.text(item, margin, yPos + (index * 6));
    });

    yPos += garantias.length * 6 + 10;

    // ==================== PAGAMENTOS ====================
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.dark);
    doc.text('- Pagamentos:', margin, yPos);

    yPos += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.text);
    doc.text('1 – Valor a vista via financiamento pelo cliente.', margin, yPos);

    yPos += 20;

    // ==================== NOVA PÁGINA - PROPOSTA DO SISTEMA ====================
    
    doc.addPage();
    yPos = margin;

    // Cabeçalho da segunda página
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 25, 'F');
    
    doc.setTextColor(...colors.white);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ALFA SOLAR - PROPOSTA TÉCNICA', pageWidth / 2, 16, { align: 'center' });

    yPos = 35;

    // ==================== PROPOSTA DO SISTEMA FOTOVOLTAICO ====================
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.dark);
    doc.text('- Proposta do sistema fotovoltaico:', margin, yPos);

    yPos += 10;

    // Calcular produção mensal
    const producaoMensalReal = Math.round(potenciaInstalada * calculation.irradiacao_media * 30 * 0.80);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.text);
    
    const textoProposta = `A proposta oferece geração de ${producaoMensalReal} kwh/mês de média anual, potência do projeto de ${potenciaInstalada.toFixed(2)} kwp.`;
    doc.text(textoProposta, margin, yPos);

    yPos += 10;

    doc.text('Segue abaixo tabelas com detalhamento do dimensionamento, e custos do', margin, yPos);
    doc.text('investimento.', margin, yPos + 6);

    yPos += 20;

    // ==================== TABELAS TÉCNICAS ====================

    // Tabela 1: Dados do módulo fotovoltaico
    autoTable(doc, {
      startY: yPos,
      head: [['Dados do módulo fotovoltaico em STC', '']],
      body: [
        ['Modelo:', `${modeloModulo}`],
        ['Potência de pico:', `${calculation.placa_watts} Wp`],
        ['Eficiência informada no catálogo:', '22,8 %']
      ],
      theme: 'grid',
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.white,
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: colors.dark
      },
      columnStyles: {
        0: { cellWidth: 120, fontStyle: 'bold' },
        1: { cellWidth: 60, halign: 'center' }
      },
      margin: { left: margin, right: margin }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Tabela 2: Dados da localidade
    autoTable(doc, {
      startY: yPos,
      head: [['Dados da localidade', '']],
      body: [
        ['Cidade:', `${data.cidade.toUpperCase()}`],
        ['Energia diária fator radiação(média anual):', `${(calculation.irradiacao_media * 1000).toFixed(0)} Wh/m2/dia`]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.white,
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: colors.dark
      },
      columnStyles: {
        0: { cellWidth: 120, fontStyle: 'bold' },
        1: { cellWidth: 60, halign: 'center' }
      },
      margin: { left: margin, right: margin }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Tabela 3: Dados do inversor
    const inversorModelo = calculation.inversor.split(' ')[0] || 'SAJ';
    const inversorPotencia = Math.round(potenciaInstalada * 1000);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Dados do inversor', '']],
      body: [
        ['Modelo:', inversorModelo],
        ['Potência nominal', `${inversorPotencia} W`],
        ['Eficiência:', '98,5 %']
      ],
      theme: 'grid',
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.white,
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: colors.dark
      },
      columnStyles: {
        0: { cellWidth: 120, fontStyle: 'bold' },
        1: { cellWidth: 60, halign: 'center' }
      },
      margin: { left: margin, right: margin }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Tabela 4: Dimensionamento
    const energiaPorModulo = Math.round((calculation.placa_watts * calculation.irradiacao_media * 0.80) / 1000 * 30);
    const areaModulos = calculation.quantidade_placas * 2.5; // ~2.5m² por módulo
    const potenciaPicoModulos = calculation.quantidade_placas * calculation.placa_watts;
    
    autoTable(doc, {
      startY: yPos,
      head: [['Dimensionamento', '']],
      body: [
        ['Energia mensal desejada', `${data.consumoMedioMensal} kWh`],
        ['Energia produzida por módulo', `${energiaPorModulo} kWh`],
        ['Número de módulos', `${calculation.quantidade_placas}`],
        ['Área dos módulos', `${areaModulos.toFixed(0)} m2`],
        ['Potência de pico dos módulos', `${potenciaPicoModulos} Wp`],
        ['Número de inversores', '1']
      ],
      theme: 'grid',
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.white,
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: colors.dark
      },
      columnStyles: {
        0: { cellWidth: 120, fontStyle: 'bold' },
        1: { cellWidth: 60, halign: 'center' }
      },
      margin: { left: margin, right: margin }
    });

    yPos = (doc as any).lastAutoTable.finalY + 20;

    // ==================== VALOR DO INVESTIMENTO ====================
    
    // Caixa verde com o valor
    doc.setFillColor(...colors.success);
    doc.roundedRect(margin, yPos, 100, 15, 3, 3, 'F');
    
    doc.setTextColor(...colors.white);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Valor do investimento:', margin + 5, yPos + 6);
    
    doc.setFontSize(18);
    doc.text(`R$ ${calculation.custo_estimado.toLocaleString('pt-BR')}`, margin + 5, yPos + 12);

    // ==================== RODAPÉ ====================
    
    const addFooter = (pageNum: number) => {
      const footerY = pageHeight - 25;
      
      // Linha decorativa
      doc.setDrawColor(...colors.primary);
      doc.setLineWidth(1);
      doc.line(margin, footerY, pageWidth - margin, footerY);
      
      // Informações da empresa
      doc.setTextColor(...colors.text);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('ALFA SOLAR - Energia Solar Fotovoltaica', margin, footerY + 6);
      doc.setFont('helvetica', 'normal');
      doc.text('Av. Joaquim Constantino, 1880 - Vila Nova Prudente - Presidente Prudente/SP', margin, footerY + 11);
      doc.text('CEP: 19050-220 | (18) 99697-6413 | atendimentoalfasolar@gmail.com', margin, footerY + 16);
      
      // Página
      doc.text(`Página ${pageNum}`, pageWidth - margin, footerY + 11, { align: 'right' });
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
        'Content-Disposition': `attachment; filename="Orcamento-Alfa-Solar-${Date.now()}.pdf"`,
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
