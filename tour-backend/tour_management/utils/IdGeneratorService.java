package com.tourbooking.tour_management.utils;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IdGeneratorService {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public String generateId(String prefix, String sequenceName) {
        // Gọi Sequence từ Postgres và định dạng chuỗi (ví dụ: BK + 00001)
        String sql = "SELECT '" + prefix + "' || LPAD(nextval('" + sequenceName + "')::text, 5, '0')";
        return (String) entityManager.createNativeQuery(sql).getSingleResult();
    }
}