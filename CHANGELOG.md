# Saphyre Data – Changelog

## Version 1.1.3
* **[BUG-FIX]** Fixed a problem causing Aggregation functions to not generate GROUP BY on other fields.

## Version 1.1.2
* **[BUG-FIX]** BOOLEAN fields will always return as Boolean in MySQL

## Version 1.1.1
* **[BUG-FIX]** BIGINT fields will always return as String in SQLite

## Version 1.1.0
* **[FEATURE]** Added support to PostgreSQL
* **[FEATURE]** Added support to schemas
* **[FEATURE]** Added support to custom field_name
* **[BUG-FIX]** Fixed an issue when handling BIGINT fields with large numbers (now returning String).