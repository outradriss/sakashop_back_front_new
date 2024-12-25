/*
package com.example.sakashop.Configurations;

import com.example.sakashop.DAO.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@EnableScheduling
@Configuration
public class SchedulerConfig {
  private static final Logger log = LoggerFactory.getLogger(SchedulerConfig.class);

  private final JobLauncher jobLauncher;
  private final Job batchJob;
  private final ProductRepository productRepository;

  public SchedulerConfig(JobLauncher jobLauncher, Job batchJob,ProductRepository productRepository) {
    this.jobLauncher = jobLauncher;
    this.batchJob = batchJob;
    this.productRepository=productRepository;
  }

  @Scheduled(fixedRate = 300000) // Toutes les 5 minutes
  public void runBatchJob() throws Exception {
    long itemCount =productRepository .countItemsToCheck();
    if (itemCount > 0) {
      log.info("Items à traiter : {}. Lancement du batch.", itemCount);
      JobParameters jobParameters = new JobParametersBuilder()
        .addLong("startAt", System.currentTimeMillis()) // Paramètre unique
        .toJobParameters();
      jobLauncher.run(batchJob, jobParameters);
    } else {
      log.info("Aucun item à traiter. Batch non exécuté.");
    }
  }

  private void notifyAdmin(String subject, Exception ex) {
    // Exemple de notification par email ou autre
    log.info("Notification envoyée : {} - {}", subject, ex.getMessage());
  }

}
*/
