---
title: "Scholar Mails Crawler"
date: 2025-03-02T23:41:12+07:00
draft: false
author: "AI4Code"
---

# Scholar Mails Crawler

Một công cụ được thiết kế để tự động trích xuất và tổ chức các ấn phẩm học thuật từ Google Scholar được gửi qua email. Bằng cách phân tích các email cảnh báo, dự án này thu thập siêu dữ liệu như tiêu đề bài báo và liên kết của chúng để giúp các nhà nghiên cứu cập nhật những ấn phẩm mới nhất trong lĩnh vực của họ.

{{< tagsInput id="keywords" label="Keywords" >}}
{{< tagsInput id="years" label="Years" >}}

| Topic | Branch | Papers |
|-------|--------|--------|

<script type="text/javascript">
  async function fetchData() {
    const url = 'https://raw.githubusercontent.com/manhtdd/scholar_alters/master/data/papers.jsonl'; 
    try {
      const response = await fetch(url);
    //   const data = await response.json();

      const data = [
      {
        "title": "Research on AI in Healthcare",
        "link": "https://example.com/paper1",
        "topic": "Artificial Intelligence",
        "branch": "Healthcare"
      },
      {
        "title": "Quantum Computing for Beginners",
        "link": "https://example.com/paper2",
        "topic": "Quantum Computing",
        "branch": "Computer Science"
      },
      {
        "title": "Deep Learning for Natural Language Processing",
        "link": "https://example.com/paper3",
        "topic": "Deep Learning",
        "branch": "NLP"
      },
      {
        "title": "Blockchain Technology and Its Applications",
        "link": "https://example.com/paper4",
        "topic": "Blockchain",
        "branch": "Cryptography"
      }
    ];

      window.fetchedData = data;

      const table = document.querySelector('table tbody');
      table.innerHTML = ''; 

      data.forEach(paper => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${paper.topic || 'N/A'}</td>
          <td>${paper.branch || 'N/A'}</td>
          <td><a href="${paper.link}" target="_blank">${paper.title}</a></td>
        `;
        table.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching the data:', error);
    }
  }

  // Search function to filter the table based on tags input
  function searchTable() {
    const keywords = document.getElementById('keywords').value.toLowerCase();
    const topics = document.getElementById('topics').value.toLowerCase();
    
    // Filter fetched data based on tags and rebuild the table
    const filteredData = window.fetchedData.filter(paper => {
      const matchesKeywords = keywords ? paper.title.toLowerCase().includes(keywords) : true;
      const matchesTopics = topics ? paper.topic.toLowerCase().includes(topics) : true;
      return matchesKeywords && matchesTopics;
    });

    // Rebuild the table with filtered data
    const table = document.querySelector('table tbody');
    table.innerHTML = '';  // Clear existing rows
    filteredData.forEach(paper => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${paper.topic || 'N/A'}</td>
        <td>${paper.branch || 'N/A'}</td>
        <td><a href="${paper.link}" target="_blank">${paper.title}</a></td>
      `;
      table.appendChild(row);
    });
  }

  // Call the fetchData function when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    // Add event listeners to the tags input fields for search
    document.getElementById('keywords').addEventListener('input', searchTable);
    document.getElementById('topics').addEventListener('input', searchTable);
  });
</script>