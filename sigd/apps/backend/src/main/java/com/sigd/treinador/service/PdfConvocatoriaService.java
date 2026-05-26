package com.sigd.treinador.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.sigd.core.model.Atleta;
import com.sigd.core.model.Convocatoria;
import com.sigd.core.repository.ConvocatoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class PdfConvocatoriaService {

    private final ConvocatoriaRepository convocatoriaRepo;

    public PdfConvocatoriaService(ConvocatoriaRepository convocatoriaRepo) {
        this.convocatoriaRepo = convocatoriaRepo;
    }

    @Transactional(readOnly = true)
    public byte[] gerarPdfConvocatoria(Long convocatoriaId) {
        Convocatoria convocatoria = convocatoriaRepo.findById(convocatoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Convocatória não encontrada"));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Título
        Paragraph title = new Paragraph("CONVOCATÓRIA OFICIAL - BOAVISTA FC")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(18)
                .setBold()
                .setMarginBottom(20);
        document.add(title);

        // Informações da Equipa e Jogo
        String equipaNome = convocatoria.getEvento().getEquipa() != null ? convocatoria.getEvento().getEquipa().getNome() : "-";
        String escalao = convocatoria.getEvento().getEquipa() != null && convocatoria.getEvento().getEquipa().getEscalao() != null ? convocatoria.getEvento().getEquipa().getEscalao().getDesignacao() : "-";

        document.add(new Paragraph("Equipa: " + equipaNome + " (" + escalao + ")").setBold());
        document.add(new Paragraph("Adversário: " + convocatoria.getEvento().getAdversario()));
        
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String dataJogo = convocatoria.getEvento().getData() != null ? convocatoria.getEvento().getData().format(dateFormatter) : "-";
        String horaJogo = convocatoria.getEvento().getHoraInicio() != null ? convocatoria.getEvento().getHoraInicio().toString() : "-";
        
        document.add(new Paragraph("Data do Jogo: " + dataJogo + " às " + horaJogo));
        document.add(new Paragraph("Local do Jogo: " + convocatoria.getEvento().getLocal()));
        
        document.add(new Paragraph("Concentração: " + convocatoria.getLocalConcentracao() + " às " + convocatoria.getHoraConcentracao())
                .setMarginBottom(20));

        // Lista de Atletas
        document.add(new Paragraph("Atletas Convocados:").setBold().setMarginBottom(10));

        Table table = new Table(UnitValue.createPercentArray(new float[]{1, 3}))
                .useAllAvailableWidth();
        table.addHeaderCell(new Cell().add(new Paragraph("Nº Sócio / Posição").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Nome").setBold()));

        for (Atleta atleta : convocatoria.getAtletas()) {
            String extraInfo = atleta.getNumeroSocio() != null ? atleta.getNumeroSocio() : atleta.getPosicao();
            if (extraInfo == null) extraInfo = "-";
            table.addCell(new Cell().add(new Paragraph(extraInfo)));
            table.addCell(new Cell().add(new Paragraph(atleta.getNomeCompleto())));
        }

        document.add(table);

        // Rodapé
        Paragraph footer = new Paragraph("Emitido em: " + LocalDate.now().format(dateFormatter))
                .setTextAlignment(TextAlignment.RIGHT)
                .setFontSize(10)
                .setMarginTop(30);
        document.add(footer);

        document.close();

        return baos.toByteArray();
    }
}
