const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    const emailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    };

    if (emailConfig.auth.user && emailConfig.auth.pass) {
      this.transporter = nodemailer.createTransporter(emailConfig);
      this.isConfigured = true;
    } else {
      console.log('Email service not configured - missing credentials');
    }
  }

  async sendLowStockAlert(lowStockItems) {
    if (!this.isConfigured) {
      console.log('Email service not configured - logging low stock alert:');
      console.log('Low stock items:', lowStockItems);
      return {
        success: false,
        message: 'Email service not configured'
      };
    }

    try {
      const itemsList = lowStockItems.map(item => 
        `- ${item.name}: ${item.stock} remaining`
      ).join('\n');

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || 'admin@vendingmachine.com',
        subject: '⚠️ Vending Machine Low Stock Alert',
        text: `
The following items are running low on stock:

${itemsList}

Please restock these items as soon as possible.

Time: ${new Date().toLocaleString()}
Machine ID: ${process.env.MACHINE_ID || 'VM001'}
        `,
        html: `
<h2>⚠️ Vending Machine Low Stock Alert</h2>
<p>The following items are running low on stock:</p>
<ul>
${lowStockItems.map(item => `<li><strong>${item.name}</strong>: ${item.stock} remaining</li>`).join('')}
</ul>
<p>Please restock these items as soon as possible.</p>
<hr>
<p><small>Time: ${new Date().toLocaleString()}</small></p>
<p><small>Machine ID: ${process.env.MACHINE_ID || 'VM001'}</small></p>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('Failed to send low stock alert:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendDailyReport(reportData) {
    if (!this.isConfigured) {
      console.log('Email service not configured - logging daily report:');
      console.log('Report data:', reportData);
      return {
        success: false,
        message: 'Email service not configured'
      };
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || 'admin@vendingmachine.com',
        subject: `📊 Daily Vending Machine Report - ${new Date().toLocaleDateString()}`,
        text: `
Daily Vending Machine Report

Revenue: $${reportData.totalRevenue.toFixed(2)}
Transactions: ${reportData.totalTransactions}
Average Transaction: $${(reportData.totalRevenue / reportData.totalTransactions).toFixed(2)}

Top Products:
${reportData.topProducts?.map(p => `- ${p.name}: ${p.sales} sold`).join('\n') || 'No sales data available'}

Date: ${new Date().toLocaleDateString()}
Machine ID: ${process.env.MACHINE_ID || 'VM001'}
        `,
        html: `
<h2>📊 Daily Vending Machine Report</h2>
<h3>Summary</h3>
<ul>
  <li><strong>Revenue:</strong> $${reportData.totalRevenue.toFixed(2)}</li>
  <li><strong>Transactions:</strong> ${reportData.totalTransactions}</li>
  <li><strong>Average Transaction:</strong> $${(reportData.totalRevenue / reportData.totalTransactions).toFixed(2)}</li>
</ul>

<h3>Top Products</h3>
<ul>
${reportData.topProducts?.map(p => `<li><strong>${p.name}</strong>: ${p.sales} sold</li>`).join('') || '<li>No sales data available</li>'}
</ul>

<hr>
<p><small>Date: ${new Date().toLocaleDateString()}</small></p>
<p><small>Machine ID: ${process.env.MACHINE_ID || 'VM001'}</small></p>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('Failed to send daily report:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async testConnection() {
    if (!this.isConfigured) {
      return {
        success: false,
        message: 'Email service not configured'
      };
    }

    try {
      await this.transporter.verify();
      return {
        success: true,
        message: 'Email service connected successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new EmailService();