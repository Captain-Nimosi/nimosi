---
layout: post
title: archive
permalink: /archive/
back_url: /
---

{% assign categories = site.categories | sort %}

{% for category in categories %}
<a href="{{ site.baseurl }}/{{ category[0] }}/">{{ category[0] }}</a><br>
{% endfor %}
