package com.example.sakashop.controllers;

import org.springframework.web.bind.annotation.*;
import javax.print.*;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/print")
@CrossOrigin ("*")
public class PrintController {
    private final ExecutorService executorService = Executors.newSingleThreadExecutor(); // Thread pour l'impression

    @PostMapping("/ticket")
    public String printTicket(@RequestBody String ticketContent) {
      try {
        // Lancer l'impression en tâche de fond
        executorService.submit(() -> printAsync(ticketContent));

        // Retourner immédiatement une réponse à Angular
        return "✅ Impression en cours...";
      } catch (Exception e) {
        e.printStackTrace();
        return "❌ Erreur lors du lancement de l'impression : " + e.getMessage();
      }
    }

    private void printAsync(String ticketContent) {
      try {
        // Trouver l'imprimante POS par défaut
        PrintService printService = PrintServiceLookup.lookupDefaultPrintService();
        if (printService == null) {
          throw new RuntimeException("Aucune imprimante POS trouvée !");
        }

        // Ajouter des lignes vides et commande de découpe (ESC/POS)
        ticketContent += "\n\n\n";
        byte[] ticketData = ticketContent.getBytes("UTF-8");
        byte[] cutCommand = new byte[]{0x1D, 0x56, 0x41, 0x00}; // ESC/POS CUT
        byte[] fullTicket = new byte[ticketData.length + cutCommand.length];

        System.arraycopy(ticketData, 0, fullTicket, 0, ticketData.length);
        System.arraycopy(cutCommand, 0, fullTicket, ticketData.length, cutCommand.length);

        // Spécifier le format d'impression
        DocFlavor flavor = DocFlavor.BYTE_ARRAY.AUTOSENSE;
        Doc doc = new SimpleDoc(fullTicket, flavor, null);

        // Créer une tâche d'impression
        DocPrintJob job = printService.createPrintJob();
        job.print(doc, null);

        System.out.println("✅ Impression lancée sur : " + printService.getName());
      } catch (Exception e) {
        e.printStackTrace();
        System.err.println("❌ Erreur lors de l'impression : " + e.getMessage());
      }
    }
  }
