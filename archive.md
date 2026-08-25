---
layout: post
title: archive
permalink: /archive/
---

{% assign categories = site.categories | sort %}

<div class="archive-list">
{% for category in categories %}
  <div><a href="{{ site.baseurl }}/{{ category[0] }}/">{{ category[0] }}</a></div>
{% endfor %}
</div>
